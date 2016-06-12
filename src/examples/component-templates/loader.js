'use strict';

import {DUM} from '../../dum-core/dum';

export let Loader = DUM.Component((options) => {
  let opts = Object.assign({
    type: 'linear',
    size: 'medium',
    color: 'blue',
    activeWhen: () => false
  }, options);

  if(opts.type === 'linear') {
    return DUM
    .div
    .setClass('progress')
    .setStyles({position: 'fixed'})
    .append(
      DUM.div.setClass('indeterminate')
    );
  } else if (opts.type === 'circular') {
    let wrapper = DUM.div.setClass('preloader-wrapper');
    if(opts.size !== 'medium') wrapper.setClass(opts.size);
    
    wrapper.append(
      DUM.div.setClass('spinner-layer', `spinner-${opts.color}-only`).append(
        
        DUM.div.setClass('circle-clipper', 'left').append(
          DUM.div.setClass('circle')
        ),
        
        DUM.div.setClass('gap-patch').append(
          DUM.div.setClass('circle')
        ),
        
        DUM.div.setClass('circle-clipper', 'right').append(
          DUM.div.setClass('circle')
        )
      )
    );  

    wrapper
    .subscribe('loaderStart', () => {
      wrapper.setClass('active');
    })
    .subscribe('loaderStop', () => {
      wrapper.removeClass('active');
    })

    return wrapper;
  } else {
    throw new Error('Loader type needs to be either \'linerar\' or \'circular\'');
  }
  
})