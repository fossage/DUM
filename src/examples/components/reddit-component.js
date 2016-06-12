import {DUM} from '../../dum-core/dum';
import {Reddit} from '../services/reddit-service';
import {List} from '../component-templates/list';
import * as Grid from '../component-templates/grid';

export let reddit = DUM.Component((options = {}) => {
  
  /*======= ELEMENT SETUP =======*/
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
    Grid.Col12().setClass('input-field').append(
      inputElement,
      submitButton
    )
  );

  /*======= MAIN COMPONENT ASSEMBLY =======*/
  let container = DUM.div.append(
    input
  ).setClass('container');
  
  /*======= INITIALIZATION =======*/
  Reddit.authorize()
  .then(() => {
    return _getSubreddit(options.sub || 'all', options.type);
  });

  /*========= PRIVATE FUNCTIONS =========*/
  let list = null;
  function _getSubreddit(subName) {
    if(list) list.empty();
    return Reddit.get({subReddit: subName})
    .then((resp) => {
      list = List({ items: resp.data.children, itemTemplate: _itemTemplate})
      .setClass('collection')
      .setStyles({width: '90%', maxWidth: '1000px', margin: '0 auto', border: 'none'});

      list.prepend(
        DUM.li.append(
          DUM.h4.text(`/r/${subName}`).setClass('collection-header')
        )
      );

      container.append(list)
    });
  }

  function _itemTemplate(item) {
    let thumbnail = item.data.thumbnail !== 'default' && item.data.thumbnail !== 'self' ? item.data.thumbnail : 'http://66.media.tumblr.com/avatar_afef10890beb_128.png';
    
    return DUM.li.setClass('collection-item', 'avatar').append(
      DUM.img.setClass('circle').setSrc(thumbnail),
      DUM.a.text(item.data.title).setHref(item.data.url).attr('target', '_blank'),
      DUM.p.append(
        DUM.span.append(DUM.i.setClass('material-icons').text('thumb_up').setStyles({color: '#4db6ac'})),
        DUM.span.text(item.data.ups)
      )
    )
  }
  
  
  return container;
});