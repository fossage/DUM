import {DUM} from '../../dum-core/dum';
import {List} from '../component-templates/list';
// export let deepstream = require('../../../node_modules/deepstream.io-client-js/src/client.js');
// export let ds = deepstream( 'localhost:6020' ).login();
// export let record = ds.record.getRecord( 'someUser' );

export let todoList = DUM.Component((options = {}) => {
  
  /*========= COMPONENT WRAPPER ========*/
  let wrapper = DUM
    .div
    .setClass('card')
    .setStyles({maxWidth: '600px', margin: '0 auto'})
  
  /*========= Input Element ========*/
  let input = DUM
    .input
    .setStyles({
      width: '90% !important',
      height: '20px',
      position: 'relative',
      top: '20px'
    })
    .setClass('input-field')
    .setType('text');
    
  /*========= Add Item Button ========*/
  let button = DUM
    .a
    .setStyles({ 
      position: 'relative',
      top: '18px'
    })
    .setClass('btn', 'btn-floating', 'cyan')
    .click(() => {
      let val = input.val();
      if(!val) return false;
      input.val(null);
      
      list.append(itemTemplate({val: val}));
    })
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
        .setStyles({textAlign: 'center'})
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
        .setStyles({cursor: 'pointer'})
        .text('delete')
        .click(() => {i.remove()})
      )

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

  return wrapper.append(list);
})
