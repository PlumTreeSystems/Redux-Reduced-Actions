var deepFreeze = require('deep-freeze');
var assert = require('assert');
var store = require('./store');
var ReducedAction = require('../dist/ReducedAction').default;
deepFreeze(store);

describe('Value extractor', function() {

  describe('#path: string', function() {
    it('should return state with replaced object target', function() {
      var path = 'string';
      var replacement = 'changed'
      var expected = 'changed';
      var ra = new ReducedAction('TEST', path, replacement);
      var result = ra.getReducedState(store).string;

      assert.equal(expected, result);
    });
  });

    describe('#path: object.simple_object.prop', function() {
      it('should return state with replaced object target', function() {
        var path = 'object.simple_object.prop';
        var replacement = 'changed'
        var expected = 'changed';
        var ra = new ReducedAction('TEST', path, replacement);
        var result = ra.getReducedState(store).object.simple_object.prop;

        assert.equal(expected, result);
      });
  });

  describe('#path: object.id_object_array[1].prop', function() {
    it('should return state with replaced object target by id', function() {
      var path = 'object.id_object_array[1].prop';
      var replacement = 'changed'
      var expected = 'changed';
      var ra = new ReducedAction('TEST', path, replacement);
      var result = ra.getReducedState(store).object.id_object_array[0].prop;

      assert.equal(expected, result);
    });
});

describe('#path: object.object_array[1].prop', function() {
  it('should return state with replaced object target by array index', function() {
    var path = 'object.object_array[1].prop';
    var replacement = 'changed'
    var expected = 'changed';
    var ra = new ReducedAction('TEST', path, replacement);
    var result = ra.getReducedState(store).object.object_array[1].prop;

    assert.equal(expected, result);
  });
});

describe('#path: object.array_array[0][0].prop', function() {
  it('should return state with replaced object prop inside array of arrays', function() {
    var path = 'object.array_array[0][0].prop';
    var replacement = 'changed'
    var expected = 'changed';
    var ra = new ReducedAction('TEST', path, replacement);
    var result = ra.getReducedState(store).object.array_array[0][0].prop;

    assert.equal(expected, result);
  });
});

describe('#path: int', function() {
  it('should return state with replaced object prop by given func', function() {
    var path = 'int';
    var replacement = function(i){return i+1;}
    var expected = 2;
    var ra = new ReducedAction('TEST', path, replacement);
    var result = ra.getReducedState(store).int;

    assert.equal(expected, result);
  });
});

});
