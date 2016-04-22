import {DUM} from '../../dum-core/dum';
import {Pane} from '../component-templates/pane';

export let weatherPane = Pane({color: 'RGB(255, 21, 30)', padding: '15px'});

weatherPane
.touchStart((el) => {
  el.animation.reverse();
  
  el.animation.eventCallback('onReverseComplete', () => {      
    [...el.childNodes].forEach((node) => { node.remove(); });
  });
});

weatherPane.subscribe('weatherLoaded', (e, data) => {
  weatherPane.append(
    DUM.h1.text('Current Weather').setClass('blade'), 
    DUM.hr,
    DUM.h1.text(`${data.main.temp}ºF`).setClass('blade'),
    DUM.h3.text(data.weather[0].description).setClass('blade')
  )
});
