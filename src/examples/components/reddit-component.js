import {DUM} from '../../dum-core/dum';
import {Reddit} from '../services/reddit-service';

export let reddit = DUM.Component((options = {}) => {
  
  /*======= ELEMENT SETUP =======*/
  let loader = DUM.div
  .setClass('progress').append(
    DUM.div.setClass('indeterminate')
  ).setStyles({position: 'fixed'});
  
  let list = DUM.ul
  .setClass('collection')
  .setStyles({width: '90%', maxWidth: '1000px', margin: '0 auto', border: 'none'})
  
  let col6 = () => DUM.div.setClass('col', 's12');
  let inputElement = DUM.input.setClass('validate').placeHolder('subreddit');
  
  let submitButton = DUM
  .a.setClass('btn-floating', 'btn-large', 'waves-effect', 'waves-light')
  .append(DUM.i.setClass('material-icons').text('add'))
  .click(() => {
    let val = inputElement.value;
    if(val) _getSubreddit(val);
  });
  
  let input = DUM
  .div.setClass('row').append(
    col6().setClass('input-field').append(
      inputElement,
      submitButton
    )
  );
  
  /*======= MAIN COMPONENT ASSEMBLY =======*/
  let container = DUM.div.append(
    loader,
    input,
    list
  );
  
  /*======= INITIALIZATION =======*/
  Reddit.authorize()
  .then(() => {
    return _getSubreddit(options.sub || 'all', options.type);
  });

  /*========= PRIVATE FUNCTIONS =========*/
  function _getSubreddit(subName) {
    list.empty();
    loader.setStyles({display: 'block'});
    return Reddit.get({subReddit: subName})
    .then((resp) => {
      loader.setStyles({display: 'none'});
      list.append(
        DUM.li.append(
          DUM.h4.text(`/r/${subName}`).setClass('collection-header')
        )
       );

      resp.data.children.forEach((item) => {
        let thumbnail = item.data.thumbnail !== 'default' && item.data.thumbnail !== 'self' ? item.data.thumbnail : 'http://66.media.tumblr.com/avatar_afef10890beb_128.png';
        
        list.append(
          DUM.li.setClass('collection-item', 'avatar').append(
            DUM.img.setClass('circle').setSrc(thumbnail),
            DUM.a.text(item.data.title).setHref(item.data.url).attr('target', '_blank'),
            DUM.p.append(
              DUM.span.append(DUM.i.setClass('material-icons').text('thumb_up').setStyles({color: '#4db6ac'})),
              DUM.span.text(item.data.ups)
            )
          )
        )
      });
    });
  }
  
  return container;
});