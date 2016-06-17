import {DUM} from '../../dum-core/dum';
import {Reddit} from '../services/reddit-service';
import {List} from '../component-templates/list';
import {Select} from '../component-templates/select';
import {Col12, Col4, Row} from '../component-templates/grid';

export let reddit = DUM.Component((options = {}) => {
  
  let responseType = '';

  /*=========================================== 
                  ELEMENT SETUP
  ============================================*/

  /*======= Input Field =======*/
  let inputElement = DUM
  .input
  .setClass('validate')
  .placeHolder('subreddit')
  .keyDown((el, e) => {
    if(e.code === 'Enter') {
      _getSubreddit(el.value);
      el.value = null;
    }
  });
  
  /*======= Submit Button =======*/
  let submitButton = Col4().append(
    DUM
    .a.setClass('btn-floating', 'btn-large')
    .append(DUM.i.setClass('material-icons').text('add'))
    .click(() => {
      let val = inputElement.value;
      
      if(val) {
        _getSubreddit(val);
        el.value = null;
      }
    })
  );

  /*======= Select Menu =======*/
  let select = Select({
    options: [
      { value: 'hot', text: 'Hot',}, 
      { value: 'new', text: 'New' }, 
      { value: 'top', text: 'Top', default: true }
    ],
    onChange: (e) => {responseType = e.value}
  }).setClass('s6')
  
  /*======= INPUT SECTION =======*/
  let inputSection = Row().append(
    Col12().setClass('input-field').append(
      inputElement,
      submitButton,
      select
    )
  );

  /*=========================================== 
                     ASSEMBLY
  ============================================*/
  let container = DUM
    .div
    .append(inputSection)
    .setClass('container');
  
  /*=========================================== 
                  INITIALIZATION
  ============================================*/
  Reddit.authorize()
  .then(() => {
    return _getSubreddit(options.sub || 'all', options.type);
  });

  /*=========================================== 
                PRIVATE FUNCTIONS
  ============================================*/
  let list = null;
  function _getSubreddit(subName) {
    if(list) list.empty();
    return Reddit.get({subReddit: subName, type: responseType})
    .then((resp) => {
      list = List({ items: resp.data.children, itemTemplate: _itemTemplate})
      .setClass('collection')

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