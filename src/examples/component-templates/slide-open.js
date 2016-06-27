import {DUM} from '../../dum-core/dum';
import {Gen} from '../services/gen-service';

export const SlideOpen = DUM.Component((opts) => { 
  
  let options = Object.assign({ 
    template: null,
    notifier: () => {}
  }, opts);

  let img = options.template();

  let container = DUM.div.append(img);
  let listener = (open) => {
    if(open) {
      container.setClass('slide-open');
    } else {
      container.removeClass('slide-open');
    }
  }

  Gen.bindData(listener, options.notifier);

  return container.setClass('slide-container'); 
});
