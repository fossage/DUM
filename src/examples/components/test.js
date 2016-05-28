import {DUM} from '../../dum-core/dum';
import {Reddit} from '../services/reddit';

export let test = () => {
  
  let container = DUM.ul.setClass('collection');
  
  Reddit.authorize()
  .then(() => {
    
    return Reddit.get()
    .then((resp) => {
      container.append(
        DUM.li.append(
          DUM.h4.text('/r/webdev').setClass('collection-header')
        )
       );

      resp.data.children.forEach((item) => {
        let thumbnail = item.data.thumbnail !== 'default' && item.data.thumbnail !== 'self' ? item.data.thumbnail : 'http://66.media.tumblr.com/avatar_afef10890beb_128.png';
        
        container.append(
          DUM.li.setClass('collection-item', 'avatar').append(
            DUM.img.setClass('circle').setSrc(thumbnail),
            DUM.a.text(item.data.title).setHref(item.data.url)
          )
        )
      });
    });
  });
  
  return container;
}