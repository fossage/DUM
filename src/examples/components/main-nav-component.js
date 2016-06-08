import {DUM} from '../../dum-core/dum';
import {HTTP} from '../services/http-service';
import {NavButton} from '../component-templates/nav-button';

export let mainNav = DUM.Component((options) => {
  
  /*=========== ELEMENT SETUP ============*/
  let navList  = [];
  let extraNav = [];
  let mainNav  = DUM.ul.setClass('right');

  options.items.forEach((item) => {
    let useLi     = !item.type || item.type === 'li';
    let group     = useLi ? navList : extraNav;
    let basicItem = DUM[item.type || 'li'].setClass(item.classes);
    
    useLi ? basicItem.append(DUM.a.text(item.text)) : basicItem.text(item.text);
  
    if(item.onClick) basicItem.click(item.onClick);
    if(item.append)  basicItem.append(item.append);
    if(item.align)   basicItem.setClass(item.align);
    if(item.goTo)    basicItem.click(() => { DUM.Router.goTo(item.goTo)});
    
    group.push(basicItem)  
  });
  
  mainNav.append(navList);

  /*=========== COMPONENT CONSTRUCTION ============*/
  let navBar = DUM.div
  .setClass('row')
  .append(
    
    DUM
    .nav
    .append(
      
      DUM
      .div
      .setClass('nav-wrapper', options.wrapperColor || 'cyan', options.wrapperClasses)
      .append(
        extraNav,
        mainNav
    )));

    return navBar;
});