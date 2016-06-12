import {DUM} from '../../dum-core/dum';

export let List = DUM.Component((opts) => { 
  
  let options = Object.assign({
    items: [],
    itemTemplate: null
  }, opts);

  let listContainer = DUM.ul;
  if(options.onContainerClick) listContainer.onClick(options.onContainerClick);

  options.items.forEach((item) => {
    listContainer.append(options.itemTemplate(item));
  });

  return listContainer; 
});