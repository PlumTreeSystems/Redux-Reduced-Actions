# Reduced Actions

> Reduced actions for Redux

## About

Reduced actions are enchanced redux actions which carry information on how to change store's state. Instead of writing custom reducers for each action, reduced actions can return reduced state themselves. This is achieved by passing state object's new property value and location of that property using special path notation. It is realy useful when state object gets large and have a complicated structure or/and app have (too) many simple actions for which writing custom reducers might get repetitive.

## Instalation and setup

Install npm module
```bash
npm install reduced-actions-redux --save-dev
```

#### Since reduced actions are more than simple objects, we need to apply custom middleware for the store. 
```javascript
import { createStore, applyMiddleware } from 'redux';
import { reducedActionMiddleware, createReducedActionReducer } from 'reduced-actions-redux';

let defaultStore = {...};
let store = createStore( mainReducer, applyMiddleware(reducedActionMiddleware) );
```
*NOTE: Reduced action middleware must come before any other middleware*

#### We also need custom reducer to handle our reduced actions.
Reduced action reducer can be used as the only reducer or alongside other reducers.

Using with the old reducer:
```javascript
import { createStore, applyMiddleware } from 'redux';
import { reducedActionMiddleware, createReducedActionReducer } from 'reduced-actions-redux';

let defaultStore = {...};
let store = createStore( createReducedActionReducer(mainReducer), applyMiddleware(reducedActionMiddleware) );
```

Using without other reducers:
```javascript
import { createStore, applyMiddleware } from 'redux';
import { reducedActionMiddleware, createReducedActionReducer } from 'reduced-actions-redux';

let defaultStore = {...};
let store = createStore( createReducedActionReducer(() => defaultStore), applyMiddleware(reducedActionMiddleware) );
```
## Usage

Given state's stucture is:
```javascript
{
  prop: {
    inner_prop: {
       changed: false 
    }
  },  
 ...
}
```

to update property "changed" all we need to do is simply create and dispacth ReducedAction object

```javascript
import ReducedAction, { extractValue } from 'reduced-actions-redux';

...
store.dispatch( new ReducedAction('CHANGE_ACTION', 'prop.inner_prop.changed', true) );

```
ReducedAction constructor takes 3 parameters:

1. Action name 
2. Path to the property
3. New value

New value can be a function which takes old value as an argument:

```javascript
import ReducedAction, { extractValue } from 'reduced-actions-redux';

...
store.dispatch( new ReducedAction('CHANGE_ACTION', 'prop.inner_prop.changed', oldValue => !oldValue ) );

```
## Path
Path notation is intuitive and is expressed as if you would acces normal JS object's properties.

+ *.* - denotes object property access
+ *[i]* - denotes array item access

If referenced array contains objects which have id properties **i** refers to object's "id" property value, otherwise **i** refers to array index.

