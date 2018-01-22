'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.extractValue = extractValue;
exports.reducedActionMiddleware = reducedActionMiddleware;
exports.createReducedActionReducer = createReducedActionReducer;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StringPathHelpers = {
    hasIndex: function hasIndex(path) {
        return path.indexOf('[') >= 0;
    },
    getPropName: function getPropName(path) {
        var indexStart = path.indexOf('[');
        return path.substr(0, indexStart);
    },
    popPropName: function popPropName(path) {
        var indexStart = path.indexOf('[');
        return path.substr(indexStart);
    },
    getFirstIndexValue: function getFirstIndexValue(path) {
        var id = path.substr(1, path.indexOf(']') - 1);
        if (id == '') {
            throw new Error('Index can not be empty.');
        }
        return id;
    },
    popFirstIndex: function popFirstIndex(path) {
        return path.substr(path.indexOf(']') + 1);
    }
};

var ReducedAction = function () {
    function ReducedAction(actionName, objectPath, newValue) {
        _classCallCheck(this, ReducedAction);

        this.type = actionName;
        this.reduced = true;
        this.objectPath = objectPath;
        this.value = newValue;
    }

    _createClass(ReducedAction, [{
        key: 'getMemento',
        value: function getMemento() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var type = this.type;
            var path = this.objectPath;
            var value = ReducedAction.resolveValue(state, path, this.value);

            return { type: type, path: path, value: value, reduced: true };
        }
    }, {
        key: 'getReducedState',
        value: function getReducedState(state) {
            var value = ReducedAction.resolveValue(state, this.objectPath, this.value);
            return ReducedAction.replaceProp(state, this.objectPath, value);
        }
    }], [{
        key: 'resolveValue',
        value: function resolveValue(state, path, resolver) {
            if (typeof resolver != 'function') {
                return resolver;
            }

            var currentValue = ReducedAction.getValueAt(state, path);
            if (currentValue != null && currentValue.constructor === Array) {
                return resolver([].concat(_toConsumableArray(currentValue)));
            } else if ((typeof currentValue === 'undefined' ? 'undefined' : _typeof(currentValue)) == 'object') {
                return resolver(Object.assign({}, currentValue));
            } else {
                return resolver(currentValue);
            }
        }
    }, {
        key: 'getValueAt',
        value: function getValueAt(state, path) {
            return extractValue(state, path);
        }
    }, {
        key: 'replaceArrayItem',
        value: function replaceArrayItem(state, path, value) {
            var segments = path;
            var newValue = value;

            if (path.constructor != Array) {
                segments = path.split('.');
            }
            if (segments.length == 0) {
                return newValue;
            }
            var head = segments[0];
            var indexStart = head.indexOf('[');
            if (indexStart != 0) {
                return ReducedAction.replaceProp(state, segments, newValue);
            }

            var id = StringPathHelpers.getFirstIndexValue(head);

            var index = -1;
            var newHead = StringPathHelpers.popFirstIndex(head);
            var tail = newHead ? [newHead].concat(_toConsumableArray(segments.slice(1))) : segments.slice(1);

            // object id strategy
            if (_typeof(state[0]) == 'object' && typeof state[0].id != 'undefined') {
                state.find(function (e, i) {
                    if (e.id == id) {
                        index = i;
                    }
                });
                if (index > -1) {
                    return [].concat(_toConsumableArray(state.slice(0, index)), [ReducedAction.replaceArrayItem(state[index], tail, newValue)], _toConsumableArray(state.slice(index + 1)));
                }
                throw new Error('Item with id "' + id + '" does not exist.');
            }
            // array index strategy
            else {
                    index = parseInt(id);
                    if (typeof state[index] != 'undefined') {
                        return [].concat(_toConsumableArray(state.slice(0, index)), [ReducedAction.replaceArrayItem(state[index], tail, newValue)], _toConsumableArray(state.slice(index + 1)));
                    }
                    throw new Error('Item with index "' + id + '" does not exist.');
                }
        }
    }, {
        key: 'replaceProp',
        value: function replaceProp(state, path, value) {
            var segments = path;
            var newValue = value;

            if (path.constructor != Array) {
                segments = path.split('.');
            }
            if (segments.length == 0) {
                return newValue;
            }

            var head = segments[0];
            var newProp = {};

            var tail = segments.slice(1);
            if (StringPathHelpers.hasIndex(head)) {
                var propName = StringPathHelpers.getPropName(head);
                if (state[propName].length < 1) {
                    throw new Error('Index "' + head + '" point through an empty array.');
                }
                newProp[propName] = ReducedAction.replaceArrayItem(state[propName], [StringPathHelpers.popPropName(head)].concat(_toConsumableArray(tail)), newValue);
            } else {
                newProp[head] = ReducedAction.replaceProp(state[head], tail, newValue);
            }

            return Object.assign({}, state, newProp);
        }
    }, {
        key: 'getActionFromMemento',
        value: function getActionFromMemento(memento) {
            return new ReducedAction(memento.type, memento.path, memento.value);
        }
    }]);

    return ReducedAction;
}();

exports.default = ReducedAction;
function extractValue(object, path) {
    var currentValue = object;
    var segments = path.split('.');
    segments.forEach(function (e, i) {
        if (StringPathHelpers.hasIndex(e)) {
            currentValue = currentValue[StringPathHelpers.getPropName(e)];
            var indexedPath = StringPathHelpers.popPropName(e);

            var _loop = function _loop() {
                if (currentValue.constructor != Array || currentValue.length < 1) {
                    throw new Error('Index "' + e + '" point through non or empty array.');
                }
                var id = StringPathHelpers.getFirstIndexValue(indexedPath);
                var index = -1;
                // object id strategy
                if (_typeof(currentValue[0]) == 'object' && typeof currentValue[0].id != 'undefined') {
                    currentValue.find(function (e, i) {
                        if (e.id == id) {
                            index = i;
                        }
                    });
                    if (index > -1) {
                        currentValue = currentValue[index];
                    } else {
                        throw new Error('Item with id "' + id + '" does not exist.');
                    }
                }
                // array index strategy
                else {
                        index = id;
                        if (typeof currentValue[parseInt(index)] != 'undefined') {
                            currentValue = currentValue[index];
                        } else {
                            throw new Error('Item with index "' + id + '" does not exist.');
                        }
                    }
                indexedPath = StringPathHelpers.popFirstIndex(indexedPath);
            };

            while (indexedPath != '') {
                _loop();
            }
        } else {
            if ((typeof currentValue === 'undefined' ? 'undefined' : _typeof(currentValue)) != 'object') {
                throw new Error('Invalid path "' + path + '". Segment "' + e + '" is unreachable');
            }
            currentValue = currentValue[e];
        }
    });
    return currentValue;
}

function reducedActionMiddleware(store) {
    return function (next) {
        return function (action) {
            if (action instanceof ReducedAction) {
                return next(action.getMemento(store.getState()));
            }
            return next(action);
        };
    };
}

function createReducedActionReducer(next) {

    return function (store, action) {
        if (action && action.reduced) {
            var newStore = ReducedAction.getActionFromMemento(action).getReducedState(store);
            return newStore;
        } else {
            return next(store, action);
        }
    };
}