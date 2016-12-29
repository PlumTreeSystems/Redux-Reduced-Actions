
let StringPathHelpers = {
  hasIndex: (path) => {
      return path.indexOf('[') >= 0;
  },
  getPropName: (path) => {
      let indexStart = path.indexOf('[');
      return path.substr(0, indexStart);
  },
  popPropName: (path) => {
      let indexStart = path.indexOf('[');
      return path.substr(indexStart);
  },
  getFirstIndexValue: (path) => {
      let id = path.substr(1, path.indexOf(']')-1);
      if(id == ''){
          throw new Error('Index can not be empty.');
      }
      return id;
  },
  popFirstIndex: (path) => {
      return path.substr(path.indexOf(']')+1);
  }
};

export default class ReducedAction {
  constructor(actionName, objectPath, newValue) {
      this.type = actionName;
      this.reduced = true;
      this.objectPath = objectPath;
      this.value = newValue;
  }

  static resolveValue(state, path, resolver){
      let currentValue = ReducedAction.getValueAt(state, path);
      if (currentValue != null && currentValue.constructor === Array){
          return resolver([...currentValue]);
      }
      else if (typeof currentValue == 'object'){
          return resolver(Object.assign({}, currentValue));
      }
      else {
          return resolver(currentValue);
      }
  }

  static getValueAt(state, path){
      return extractValue(state, path);
  }

  static replaceArrayItem(state, path, value){
      let segments = path;
      let newValue = value;

      if (path.constructor != Array){
          segments = path.split('.');
      }
      if (segments.length == 0){
          return newValue;
      }
      let head = segments[0];
      let indexStart = head.indexOf('[');
      if (indexStart != 0){
          return ReducedAction.replaceProp(state, segments, newValue);
      }

      let id = StringPathHelpers.getFirstIndexValue(head);

      let index = -1;
      let newHead =  StringPathHelpers.popFirstIndex(head);
      let tail = newHead ? [newHead, ...segments.slice(1)] : segments.slice(1);

       // object id strategy
      if (typeof state[0] == 'object' && typeof state[0].id != 'undefined'){
          state.find((e, i) => {
            if (e.id == id){
                index = i;
            }
          });
          if (index > -1){
              return [
                ...state.slice(0, index),
                ReducedAction.replaceArrayItem(state[index], tail, newValue),
                ...state.slice(index + 1)
              ];
          }
          throw new Error(`Item with id "${id}" does not exist.`);
      }
      // array index strategy
      else{
          index = id;
          if (typeof state[parseInt(index)] != 'undefined'){
            return [
              ...state.slice(0, index),
              ReducedAction.replaceArrayItem(state[index], tail, newValue),
              ...state.slice(index + 1)
            ];
          }
          throw new Error(`Item with index "${id}" does not exist.`);
      }

  }

  static replaceProp(state, path, value){
      let segments = path;
      let newValue = value;

      if (path.constructor != Array){
          segments = path.split('.');
      }
      if (segments.length == 0){
          return newValue;
      }

      let head = segments[0];
      let newProp = {};

      let tail = segments.slice(1);
      if (StringPathHelpers.hasIndex(head)){
          let propName = StringPathHelpers.getPropName(head);
          if (state[propName].length < 1){
              throw new Error(`Index "${head}" point through an empty array.`);
          }
          newProp[propName] = ReducedAction.replaceArrayItem(state[propName], [StringPathHelpers.popPropName(head), ...tail], newValue);
      }
      else{
          newProp[head] = ReducedAction.replaceProp(state[head], tail, newValue);
      }

      return Object.assign({}, state, newProp);
  }

  getMemento(state = {}){
      let type = this.type;
      let path = this.objectPath;
      let value = {};
      if (typeof this.value == 'function'){
          value = ReducedAction.resolveValue(state, path, this.value);
      }
      else{
          value = this.value;
      }

      return { type, path, value, reduced: true };
  }

  static getActionFromMemento(memento){
      return new ReducedAction(memento.type, memento.path, memento.value);
  }

  getReducedState (state){
      return ReducedAction.replaceProp(state, this.objectPath, this.value);
  }

}

export function extractValue(object, path){
    let currentValue = object;
    let segments = path.split('.');
    segments.forEach((e, i) => {
        if(StringPathHelpers.hasIndex(e)){
            currentValue = currentValue[StringPathHelpers.getPropName(e)];
            let indexedPath = StringPathHelpers.popPropName(e);
            while (indexedPath != ''){
                if (currentValue.constructor != Array || currentValue.length < 1){
                    throw new Error(`Index "${e}" point through non or empty array.`);
                }
                let id = StringPathHelpers.getFirstIndexValue(indexedPath);
                let index = -1;
                // object id strategy
                if (typeof currentValue[0] == 'object' && typeof currentValue[0].id != 'undefined'){
                    currentValue.find((e, i) => {
                      if (e.id == id){
                          index = i;
                      }
                    });
                    if (index > -1){
                        currentValue = currentValue[index];
                    }
                    else{
                        throw new Error(`Item with id "${id}" does not exist.`);
                    }
                }
                // array index strategy
                else{
                    index = id;
                    if (typeof currentValue[parseInt(index)] != 'undefined'){
                        currentValue = currentValue[index];
                    }
                    else{
                        throw new Error(`Item with index "${id}" does not exist.`);
                    }
                }
                indexedPath = StringPathHelpers.popFirstIndex(indexedPath);
            }
        }
        else{
            if (typeof currentValue != 'object'){
                throw new Error(`Invalid path "${path}". Segment "${e}" is unreachable`);
            }
            currentValue = currentValue[e];
        }
    });
    return currentValue;
}

export function reducedActionMiddleware(store){
    return next => action => {
      if (action instanceof ReducedAction){
          return next(action.getMemento(store.getState()));
      }
      return next(action);
    }
}

export function createReducedActionReducer(next){

    return (store, action) =>{
        if (action && action.reduced){
            let newStore = ReducedAction
            .getActionFromMemento(action)
            .getReducedState(store);
            return newStore;
        }
        else{
            return next(store, action);
        }
    }
}
