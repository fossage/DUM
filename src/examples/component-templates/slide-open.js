import {DUM} from '../../dum-core/dum';

export const SlideOpen = DUM.Component((opts) => { 
  
  let options = Object.assign({ 
    template: null,
    notifier: () => {}
  }, opts);

  let img = options.template();

  let container = DUM.div.append(img);

  let listener = function* () {
    while(true) {
      let open = yield;
      if(open) {
        container.setClass('slide-open');
      } else {
        container.removeClass('slide-open');
      }
    }
  }();
  
  options.notifier(listener);

  return container.setClass('slide-container'); 
});