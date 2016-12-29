module.exports = {
  string: 'string',
  int: 1,
  object: {
    simple_object: {prop: 'unchanged'},
    string: 'unchanged',
    object_array: [
      {prop: 'object1'},
      {prop: 'object2'}
    ],
    id_object_array: [
      {id: 1, prop: 'object1'},
      {id: 2, prop: 'object2'}],
    array_array: [
      [{prop: 'inner'}]
    ],
    primitive_array: ['unchanged', 1]
  },
  array: ['unchanged', 1],
  simple_object: {prop:'unchanged'}
};
