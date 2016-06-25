import {DUM} from '../../dum-core/dum';

DUM.Behavior('onInView', (el, options) => {
  let opts = Object.assign({
    cb: () => {},
    offset: 0,
    onDirection: 'any',
    once: false
  }, options);

  let _cbFired = false;
 
  DUM.decorateEl(document).scroll((elem, e) => {
    let dimensions = el.getBoundingClientRect();

    if(dimensions.top + opts.offset <= window.innerHeight && dimensions.bottom + opts.offset >=0) {
      if(!opts.once || (opts.once && !_cbFired)) {
        opts.cb(dimensions.top, dimensions.bottom);
        _cbFired = true;
      }
    }
  });
});