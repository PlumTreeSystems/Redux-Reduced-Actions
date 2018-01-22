var deepFreeze = require('deep-freeze');
var assert = require('assert');
var store = require('./store');
var ReducedAction = require('../dist/ReducedAction').default;
deepFreeze(store);

describe('Reduced state', function() {

  describe('#path: string', function() {
    it('should return state with replaced object target', function() {
      var path = 'string';
      var replacement = 'changed'
      var expected = 'changed';
      var ra = new ReducedAction('TEST', path, replacement);
      var result = ra.getReducedState(store).string;
      assert.equal(result, expected);
    });
  });

  describe('#path: object.simple_object.prop', function() {
    it('should return state with replaced object target', function() {
      var path = 'object.simple_object.prop';
      var replacement = 'changed'
      var expected = 'changed';
      var ra = new ReducedAction('TEST', path, replacement);
      var result = ra.getReducedState(store).object.simple_object.prop;
      assert.equal(result, expected);
    });
  });

  describe('#path: object.id_object_array[1].prop', function() {

    it('should return state with same number of array items', function() {
      var path = 'object.id_object_array[1].prop';
      var replacement = 'changed'
      var object_count_before = store.object.id_object_array.length;
      var ra = new ReducedAction('TEST', path, replacement);
      var reduced = ra.getReducedState(store);    
      var object_count_after = reduced.object.id_object_array.length;
      assert.equal(object_count_after, object_count_before);
    });

    it('should return state with replaced object target by id', function() {
      var path = 'object.id_object_array[1].prop';
      var replacement = 'changed'
      var expected = 'changed';
      var ra = new ReducedAction('TEST', path, replacement);
      var result = ra.getReducedState(store).object.id_object_array[0].prop;
      assert.equal(result, expected);
    });
  });

  describe('#path: object.object_array[1].prop', function() {

    it('should return state with same number of array items', function() {
      var path = 'object.object_array[1].prop';
      var replacement = 'changed'
      var object_count_before = store.object.object_array.length;
      var ra = new ReducedAction('TEST', path, replacement);
      var reduced = ra.getReducedState(store);    
      var object_count_after = reduced.object.object_array.length;
      assert.equal(object_count_after, object_count_before);
    });

    it('should return state with replaced object target by array index', function() {
      var path = 'object.object_array[1].prop';
      var replacement = 'changed'
      var expected = 'changed';
      var ra = new ReducedAction('TEST', path, replacement);
      var reduced = ra.getReducedState(store);
      var result = reduced.object.object_array[1].prop;
      assert.equal(result, expected);
    });
  });

  describe('#path: object.array_array[1][1].prop', function() {
    
    it('should return state with same number of array items', function() {
      var path = 'object.array_array[1][1].prop';
      var replacement = 'changed'
      var object_count_before = store.object.array_array[1].length;
      var inner_object_count_before = store.object.array_array.length;
      var ra = new ReducedAction('TEST', path, replacement);
      var reduced = ra.getReducedState(store);    
      var object_count_after = reduced.object.array_array[1].length;
      var inner_object_count_after = reduced.object.array_array.length;
      assert.equal(object_count_after, object_count_before, "Outer array length is different");
      assert.equal(inner_object_count_after, inner_object_count_before, "Inner array length is different");
    });

    it('should return state with replaced object prop inside array of arrays', function() {
      var path = 'object.array_array[1][1].prop';
      var replacement = 'changed'
      var expected = 'changed';
      var ra = new ReducedAction('TEST', path, replacement);
      var result = ra.getReducedState(store).object.array_array[1][1].prop;
      assert.equal(result, expected);
    });
  });

  describe('#path: int', function() {
    it('should return state with replaced object prop by given func', function() {
      var path = 'int';
      var replacement = function(i){return i+1;}
      var expected = 2;
      var ra = new ReducedAction('TEST', path, replacement);
      var result = ra.getReducedState(store).int;
      assert.equal(result, expected);
    });
  });
});
