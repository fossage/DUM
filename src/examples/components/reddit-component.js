import {DUM} from '../../dum-core/dum';
import {Reddit} from '../services/reddit-service';
import {Gen} from '../services/gen-service';
import {List} from '../component-templates/list';
import {SlideOpen} from '../component-templates/slide-open';
import {Select} from '../component-templates/select';
import {Col12, Col4, Row} from '../component-templates/grid';

export const reddit = DUM.Component((options = {}) => {
  
  let responseType = '';
  let after = '';

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
      Gen.co(_subThenList.bind(null, el.value));
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
        Gen.co(_subThenList.bind(null, val));
        inputElement.value = null;
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
  Gen.co(function *(){
    let subName = options.sub || 'all';
    yield Reddit.authorize();
    let response = yield _getSubreddit(subName);
    console.log(response)
    after = response.data.after;
    yield _constructList.bind(null, response, subName);
  })
  .catch((e) => {
    console.log(e);
  });

  /*=========================================== 
                PRIVATE FUNCTIONS
  ============================================*/
  let list = null;
  let lastReddit = null;
  
  
  function _slideNotify() {
    let currentVal = true;
    let genr;
    
    return (gen) => {
      if(gen) genr = gen;
      currentVal = !currentVal;
      genr.next(currentVal);
    }
  }
  
  function _getSubreddit(subName) {
    if(list) list.empty();
    lastReddit = {subReddit: subName, type: responseType, queryParams: {limit: 20}};
    return Reddit.get(lastReddit);
  }

  function _constructList(resp, subName) {
    list = List({ items: resp.data.children, itemTemplate: _itemTemplate})
    .setClass('collection');

    list.prepend(
      DUM.li.append(
        DUM.h4.text(`/r/${subName}`).setClass('collection-header')
      )
    );

    container.append(list);
  }

  function _itemTemplate(item, idx, length) {
    let img = DUM.img;
    let thumbnail = item.data.thumbnail !== 'default' && item.data.thumbnail !== 'self' ? item.data.thumbnail : 'http://66.media.tumblr.com/avatar_afef10890beb_128.png';
    let notifier = _slideNotify();
    let slide = SlideOpen({
      notifier: notifier,
      template: slideTemplate
    });


    function slideTemplate() {
      return img;
    }
    
    let li = DUM.li.setClass('collection-item', 'avatar').append(
      DUM.img.setClass('circle').setSrc(thumbnail),
      DUM.a.text(item.data.title).setHref(item.data.url).attr('target', '_blank'),
      DUM.p.append(
        DUM.span.append(DUM.i.setClass('material-icons').text('thumb_up').setStyles({color: '#4db6ac'})),
        DUM.span.text(item.data.ups)
      ),
      slide
    )
    .click(() => {
      let srcs = item.data.preview.images[0].resolutions;
      Reddit.getImage(srcs[srcs.length - 1].url)
      .then((src) => {
        img.setSrc(src);
        notifier();
      })
    })

    if(idx === length -1) {
      li.behavior('onInView', {
        cb: (val) => { 
          lastReddit.queryParams = {after: after, limit: 20};
          
          Reddit.get(lastReddit)
          .then((res) => {
            after = res.data.after;
            
            res.data.children.forEach((itm, i) => {
              list.append(_itemTemplate(itm, i, res.data.children.length))
            });
          })
          .catch(e => console.log(e)); 
        },
        offset: 20,
        once: true
      });
    }
    return li;
  }
  
  function* _subThenList(val){
    let res = yield  _getSubreddit(val);
    after = res.data.after;
    yield _constructList.bind(null, res, val);
  }

  return container;
});