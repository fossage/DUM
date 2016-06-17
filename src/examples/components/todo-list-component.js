import {DUM} from '../../dum-core/dum';
import {List} from '../component-templates/list';

export let todoList = DUM.Component((options = {}) => {
  
  /*========= COMPONENT WRAPPER ========*/
  let wrapper = DUM
  .div
  .setClass('card', 'todo-wrapper');
  
  /*========= Input Element ========*/
  let input = DUM
  .input
  .setClass('input-field')
  .setType('text')
  .keyDown((el, e) => { if(e.code === 'Enter') _updateList(); });
    
  /*========= Add Item Button ========*/
  let button = DUM
  .a
  .setClass('btn', 'btn-floating', 'cyan')
  .click(() => _updateList())
  .append(
    DUM
    .i
    .setClass('material-icons')
    .text('add')
  );

  /*========= Input Data LI ========*/
  let inputItem = DUM
  .li
  .setClass('collection-item', 'todo-input')
  .append(input, button);
  
  /*========= List Header LI ========*/
  let headerItem = DUM
  .li
  .setClass('collection-header')
  .append(
    DUM
    .h4
    .text('Todo List')
  );

  /*========= LI TEMPLATE FUNCTION ========*/
  let itemTemplate = (data) => {
    let i = DUM
    .li
    .text(data.val)
    .setClass('collection-item')
    .append(
      DUM
      .i
      .setClass('material-icons', 'right')
      .text('delete')
      .click(() => {i.remove()})
    );

    return i;
  }
  
  /*========= MAIN LIST CONSTRUCTOR ========*/
  let list = List({
    listClasses: ['collection', 'with-header', 'highlight'],
    items: [{val: 'thing'}, {val: 'otherThing'}],
    itemTemplate: itemTemplate
  })
  .setClass('collection', 'with-header', 'highlight')
  .prepend(headerItem, inputItem);

  if(options.items) options.items.forEach((itm) => {
    list.append(itemTemplate({val: itm}));
  });

  /*========= HELPERS ========*/
  function _updateList () {
    let val = input.val();
    if(!val) return false;
    input.val(null);
    list.append(itemTemplate({val: val}));
  }


  return wrapper.append(list);
})
