import {DUM} from '../../dum-core/dum';
/**
 * @todo: All methods should return the object operated on except contains(which should only return a boolean) and
 * remove in the case where the object that we are trying to remove doesn't exist. Also should look into making objects
 * in cache immutable with Object.freeze()
 */
  
export let LRU = DUM.service('LRU');

let _maxSize = 25;
let _currentSize = 0;
let _freshEnd = null;
let _staleEnd = null;
let _hash = Object.create(null);

/*======== METHODS ========*/
Object.assign(LRU, {
  put: put,
  get: get,
  info: info,
  clear: clear,
  remove: remove,
  update: update,
  untrust: untrust,
  contains: contains
});

/*================================================
                METHOD DEFINITIONS
================================================*/
function info() {
  return {
    maxSize: _maxSize,
    currentSize: _currentSize,
    freshEnd: _freshEnd,
    staleEnd: _staleEnd
  };
}

function update(id, updateCb) {
  updateCb(_hash[id]);
}

function untrust() {
  for (let key in _hash) {
    _hash[key].trusted = false;
  }
}

function put(id, newData) {
  if (!_maxSize) {
    return false;
  } else {
    if (typeof newData === 'undefined' || newData === null) {
      Logger.error('putting undefined or null resource in LRU.');
      return;
    }

    if (id in _hash) {
      let item = _spliceOut(_hash[id]);
      item.trusted = true;
      _pushFresh(item);
      return item;
    }

    let node = _.extend({
      trusted: true,
      next: null,
      prev: null
    }, newData);

    _hash[id] = node;
    _pushFresh(node);
    
    return newData;
  }
}

function clear() {
  _hash = Object.create(null);
}

function remove(id) {
  if (!(id in _hash)) {
    return false;
  }

  _spliceOut(_hash[id]);
  delete _hash[id];
}

function get(id) {
  if (!(id in _hash)) {
    return false;
  }

  let cachedObj = _hash[id];
  if (_currentSize < 2 || _freshEnd === cachedObj) {
    return cachedObj;
  } else {
    return _pushFresh(_spliceOut(cachedObj));
  }
}

function contains(id) {
  return id in _hash;
}

/*================================================
                PRIVATE FUNCTIONS
================================================*/
function _pushFresh(obj) {
  if (_currentSize < 1) {
    _freshEnd = obj;
    _staleEnd = obj;
  } else {
    if (_currentSize >= _maxSize) {
      _popStale();
    }

    let oldFresh = _freshEnd;
    _freshEnd = obj;
    _freshEnd.prev = null;
    _freshEnd.next = oldFresh;
    oldFresh.prev = _freshEnd;
  }

  _currentSize += 1;
  return obj;
}

function _popStale() {
  if (_staleEnd === null) {
    return false;
  }

  let staleObj = _staleEnd;
  
  if (_currentSize < 2) {
    _staleEnd = null;
    _freshEnd = null;
  } else {
    _staleEnd = staleObj.prev;
    _staleEnd.next = null;
  }

  staleObj.prev = null;
  staleObj.next = null;
  _currentSize -= 1;
  
  for (let key in _hash) {
    if (_hash[key] === staleObj) {
      delete _hash[key];
      break;
    }
  }

  return staleObj;
}

function _spliceOut(cachedObj) {
  if (_currentSize < 2) {
    _staleEnd = null;
    _freshEnd = null;
  } else if (_freshEnd === cachedObj) {
    _freshEnd = _freshEnd.next;
    _freshEnd.prev = null;
    cachedObj.next = null;
  } else if (_staleEnd === cachedObj) {
    _staleEnd = _staleEnd.prev;
    _staleEnd.next = null;
    cachedObj.prev = null;
  } else {
    cachedObj.prev.next = cachedObj.next;
    cachedObj.next.prev = cachedObj.prev;
    cachedObj.next = null;
    cachedObj.prev = null;
  }

  _currentSize -= 1;
  
  return cachedObj;
}
