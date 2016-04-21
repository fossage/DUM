import {DUM} from '../../dum-core/dum';
export let deepstream = require('../../node_modules/deepstream.io-client-js/src/client.js');
export let ds = deepstream( 'localhost:6020' ).login();
export let record = ds.record.getRecord( 'someUser' );

export let todoList = () => {
  let wrapper = DUM
    .div
    .setClass('card')
    .setStyles({maxWidth: '600px', margin: '0 auto'})
    
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
    
  let button = DUM
    .a
    .setStyles({ 
      position: 'relative',
      top: '18px'
    })
    .setClass('btn', 'btn-floating', 'waves-effect', 'waves-light', 'cyan')
    .click(() => {
      let val = input.val();
      if(!val) return false;
      input.val(null);
      record.set( 'todoItem', val );
    })
    .append(
      
      DUM
      .i
      .setClass('material-icons')
      .text('add')
    );
    
  let list = DUM
    .ul
    .setClass('collection', 'with-header')
    .append(
      
      DUM
      .li
      .setClass('collection-header')
      .append(
        
        DUM
        .h4
        .text('ToDo List')
        .setStyles({textAlign: 'center'}))
    )
    .append(
      
      DUM
      .li
      .setClass('collection-item')
      .append(input, button)
    );
    
  record.subscribe( 'todoItem',(val) => {
    list.append(DUM.li.text(val).setClass('collection-item'));
  });
    
  return wrapper.append(list);
}
