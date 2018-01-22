module.exports = {
  string: 'string',
  int: 1,
  object: {
    simple_object: {prop: 'unchanged'},
    string: 'unchanged',
    object_array: [
      {prop: 'object1'},
      {prop: 'object2'},
      {prop: 'object3'},
      {prop: 'object4'},
    ],
    id_object_array: [
      {id: 1, prop: 'object1'},
      {id: 2, prop: 'object2'},
      {id: 3, prop: 'object3'},
      {id: 4, prop: 'object4'}
    ],
    array_array: [
      [{prop: 'inner'}, {prop: 'inner'}, {prop: 'inner'}],
      [{prop: 'inner'}, {prop: 'inner'}, {prop: 'inner'}],
      [{prop: 'inner'}, {prop: 'inner'}, {prop: 'inner'}],
    ],
    primitive_array: ['unchanged', 1, 2, 3]
  },
  array: ['unchanged', 1, 2, 3],
  simple_object: {prop:'unchanged'}
};
