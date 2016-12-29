var deepFreeze = require('deep-freeze');
var assert = require('assert');
var store = require('./store');
var ex = require('../dist/ReducedAction').extractValue;
deepFreeze(store);

describe('Value extractor', function() {

  describe('#object target', function() {
    it('should return object target', function() {
      var path = 'simple_object';
      var expected = 'unchanged';
      var result = ex(store, path).prop;
      assert.equal(expected, result);
    });
  });

  describe('#object prop target', function() {
    it('should return prop target', function() {
      var path = 'simple_object.prop';
      var expected = 'unchanged';
      var result = ex(store, path);
      assert.equal(expected, result);
    });
  });

  describe('#object inside object target', function() {
    it('should return prop target', function() {
      var path = 'object.simple_object.prop';
      var expected = 'unchanged';
      var result = ex(store, path);
      assert.equal(expected, result);
    });
  });

  describe('#array target', function() {
    it('should return array target', function() {
      var path = 'array';
      var expected = 'unchanged';
      var result = ex(store, path)[0];
      assert.equal(expected, result);
    });
  });

  describe('#array index as id', function() {
    it('should return item based on id', function() {
      var path = 'object.id_object_array[1]';
      var expected = 'object1';
      var result = ex(store, path).prop;
      assert.equal(expected, result);
    });
  });

  describe('#array index as index', function() {
    it('should return item based on array index', function() {
      var path = 'object.object_array[1]';
      var expected = 'object2';
      var result = ex(store, path).prop;
      assert.equal(expected, result);
    });
  });

  describe('#array double index', function() {
    it('should return item from inner array', function() {
      var path = 'object.array_array[0][0]';
      var expected = 'inner';
      var result = ex(store, path).prop;
      assert.equal(expected, result);
    });
  });

  describe('#array item prop', function() {
    it('should return prop value of array item', function() {
      var path = 'object.array_array[0][0].prop';
      var expected = 'inner';
      var result = ex(store, path);
      assert.equal(expected, result);
    });
  });


});
