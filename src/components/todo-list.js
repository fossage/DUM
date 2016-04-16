import {DOM} from '../core/elements';

export let todoList = () => {
  let wrapper = DOM
    .div
    .setClass('card')
    .setStyles({maxWidth: '600px', margin: '0 auto'})
    
  let input = DOM
    .input
    .setStyles({
      width: '90% !important',
      height: '20px',
      position: 'relative',
      top: '20px'
    })
    .setClass('input-field')
    .setType('text');
    
  let button = DOM
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
      list.append(DOM.li.text(val).setClass('collection-item'));
    })
    .append(
      DOM
      .i
      .setClass('material-icons')
      .text('add')
    );
    
  let list = DOM
    .ul
    .setClass('collection', 'with-header')
    .append(
      DOM.li.setClass('collection-header')
      .append(DOM.h4.text('ToDo List').setStyles({textAlign: 'center'}))
    )
    .append(DOM.li.setClass('collection-item').append(input, button))
    
  return wrapper.append(list);
}
