'use strict';

import {DUM} from '../../dum-core/dum';
import {tryProp} from '../../dum-core/utils/object';

export let Select = DUM.Component((options) => {
  
  // INITIAL SETUP
  let opts =  Object.assign({
    label: '',
    options: [],
    onChange: null,
    selectClassList: [],
    optionsClassList: [],
    optionTemplate: null,
    containerStyles: {}
  }, options);

  let wrapper       = DUM.div.setClass('col');
  let optionList    = [];
  let select        = null;
  let output        = null;
  let defaultOption = opts.options.find(opt => opt.default);
  
  /*============= BROWSER DEFAULT LIST =============*/
  if(!opts.optionTemplate && opts.useBrowserDefault) {
    opts.optionTemplate = (opt) => {
      return DUM
      .option
      .attr('value', opt.value)
      .text(opt.text)
      .setClass(...opts.optionsClassList);
    } 
    
    select = DUM.select.change(opts.onChange).setClass(...opts.selectClassList, 'browser-default');

    if(defaultOption) {
      optionList.push(
        DUM
        .option
        .attr('value', '')
        .attr('selected')
        .attr('disabled')
      );
    }
    _makeOptionsList();
    output = wrapper.append(select.append(optionList),DUM.label.text(opts.label));

  /*============= CUSTOM LIST =============*/
  } else if(!opts.useBrowserDefault) {
    // ELEMENT SETUP
    wrapper.setClass('select-custom');
    let heading = DUM.h4;
    
    let innerContainer = DUM
    .ul
    .setClass('collection', 'closed', 'col', 's6', 'select-custom')
    .setStyles(opts.containerStyles);

    heading
    .text(defaultOption.text || opts.options[0].text)
    .click(() => _toggleSelectOpen(innerContainer));
    
    if(!opts.optionTemplate) {
      // DEFAULT OPTIONS TEMPLATE FUNCTION
      opts.optionTemplate = (opt) => {
        let selectedClass = opt.default ? 'selected' : null;

        return DUM
        .li
        .setClass('collection-item', selectedClass)
        .text(opt.text)
        .click((el) => {
          el.parentNode.childNodes.forEach((node) => {
            node.removeClass('selected');
          });

          el.setClass('selected');
          heading.text(opt.text);
          opts.onChange({value: opt.value});
          _toggleSelectOpen(innerContainer);
        });
      }
    }
    
    // LIST CONSTRUCTIONS
    _makeOptionsList();
    innerContainer.append(optionList);
    output = wrapper.append(DUM.div.append(heading, innerContainer));
  }
  
  /*=========== HELPER FUNCTIONS ===========*/
  function _makeOptionsList() {
    opts.options.forEach((opt) => {
      optionList.push(opts.optionTemplate(opt));
    });
  }

  function _toggleSelectOpen(list) {
    if(list.classList.contains('closed')) {
      list.removeClass('closed');
      list.setClass('open');
    } else {
      list.removeClass('open');
      list.setClass('closed');
    }
  }

  return output;
});