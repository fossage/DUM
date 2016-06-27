import {DUM}              from '../../dum-core/dum';
import {Gen}              from '../services/gen-service';
import {List}             from '../component-templates/list';
import {Reddit}           from '../services/reddit-service';
import {Select}           from '../component-templates/select';
import {SlideOpen}        from '../component-templates/slide-open';
import {decodeEntities}   from '../../dum-core/utils/element';
import {isImageUri}       from '../../dum-core/utils/string';
import {Col12, Col4, Row} from '../component-templates/grid';

export const reddit = DUM.Component((options = {}) => {
  let list         = null;
  let after        = '';
  let lastReddit   = null;
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

  /*=========== ASSEMBLY ===========*/
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
    after = response.data.after;
    return _constructList(response, subName);
  })
  .catch(e => console.log(e));

  
  /*=========================================== 
                HELPER FUNCTIONS
  ============================================*/
  function _itemTemplate(item, idx, length) {
    // ELEMENT SETUP
    let _slideNotify       = _notifierFactory();
    let imgContainer       = DUM.div;
    let isDefaultThumbnail = (item.data.thumbnail !== 'default' && item.data.thumbnail !== 'self');
    let thumbnail          = isDefaultThumbnail ? item.data.thumbnail : 'http://66.media.tumblr.com/avatar_afef10890beb_128.png';
    let slideIsOpen        = false;
    let slide              = SlideOpen({ notifier: _slideNotify, template: () => imgContainer });
    let titleEl            = DUM.a.attr('target', '_blank');
    
    let observable = DUM.observe(item.data, {
      title: (newVal, oldVal) => titleEl.text(newVal)
    });

    titleEl
    .text(observable.title)
    .setHref(observable.url);

    setTimeout(() => {
      observable.title = Math.random() * 100;
    }, 1000)

    // MAIN ELEMENT CONSTRUCTION
    let li = DUM.li.setClass('collection-item', 'avatar').append(
      DUM.img.setClass('circle').setSrc(thumbnail),
      titleEl,
      DUM.p.append(
        DUM.span.append(DUM.i.setClass('material-icons').text('thumb_up').setStyles({color: '#4db6ac'})),
        DUM.span.text(observable.ups)
      ),
      slide
    )
    .click(_handleClick)


    // Attatch inView handler to last item in the list for 
    // infinite scrolling
    if(idx === length -1) {
      let onInViewOpts = {
        cb: _onInView,
        offset: 20,
        once: true
      };

      li.behavior('onInView', onInViewOpts);
    }

    function _handleClick(){
      let iframe = item.data.media_embed
      if(iframe && iframe.content) {
        slideIsOpen 
          ? _emptyAfter(imgContainer, 300) 
          : imgContainer.innerHTML = decodeEntities(iframe.content);
        
        slideIsOpen = _slideNotify.notify();
      } else {
        let previewSrcs = item.data.preview.images[0].resolutions;
        let previewUrl  = previewSrcs[previewSrcs.length - 1].url
        let originalUrl = item.data.url;
        let src         = originalUrl && isImageUri(originalUrl) ? originalUrl : previewUrl;
        
        if(slideIsOpen) {
          _emptyAfter(imgContainer, 300);
          slideIsOpen = _slideNotify.notify();
        } else {
          Reddit.getImage(src)
          .then((src) => {
            src.type === 'string' 
              ? imgContainer.innerHTML = src.data 
              : imgContainer.append(DUM.img.setSrc(src.data));
            
            slideIsOpen = _slideNotify.notify();   
          });
        }
      }
    }
    
    function _emptyAfter(el, time) {
      el
      .wait(time)
      .then(() => {
        el.empty();
      }); 
    }
    return li;
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

  function _notifierFactory() {
    return Gen.Notifier((function(){
      let val = false;
      
      return () => {
        val = !val;
        return val;
      }
    }()));
  }

  function _onInView(val){ 
    lastReddit.queryParams = {after: after, limit: 20};
    
    Reddit.get(lastReddit)
    .then((res) => {
      after = res.data.after;
      
      res.data.children.forEach((itm, i) => {
        list.append(_itemTemplate(itm, i, res.data.children.length))
      });
    })
    .catch(e => console.log(e)); 
  }

  function* _subThenList(val){
    let res = yield  _getSubreddit(val);
    after   = res.data.after;
    return _constructList(res, val);
  }

  return container;
});