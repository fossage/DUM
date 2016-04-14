import {DOM} from '../core/elements';

export let todoList = setUpTodoList();

function setUpTodoList(){
  let wrapper = DOM
    .div
    .setStyles({
      maxWidth: '500px',
      border: '1px solid #888',
      borderRadius: '4px',
      padding: '5px'
    });
    
  let input = DOM
    .input
    .setStyles({
      flex: '1',
      height: '20px',
      position: 'relative',
      top: '20px'
    });
    
  let list = DOM
    .ul
    
  let header = DOM
    .header
    .setStyles({display: 'flex'})
    .append(
      
      DOM
      .h2
      .text('ToDo List')
      .setStyles({flex: '1'}),
      
      input,
      
      DOM
      .button
      .setStyles({ 
        flex: '0.5',
        position: 'relative',
        top: '18px',
        height: '30px',
        marginLeft: '5px',
        padding: '3px',
        borderRadius: '3px'
      })
      .text('Add Item')
      .click(() => {
        let val = input.val();
        input.val(null);
        list.append(DOM.li.text(val));
      })
    );
    
  return wrapper.append(header, list);
}