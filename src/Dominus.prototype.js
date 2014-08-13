'use strict';

var core = require('./core');
var dom = require('./dom');
var Dominus = require('./Dominus.ctor');

function equals (selector) {
  return function equals (elem) {
    return dom.matches(elem, selector);
  };
}

Dominus.prototype.find = function (selector) {
  var result = this.map(function (elem) {
    return dom.qsa(elem, selector);
  });
  return core.flatten(result);
};

Dominus.prototype.findOne = function (selector) {
  var result = this.map(function (elem) {
    return dom.qs(elem, selector);
  })[0];
  return core.flatten(result);
};

Dominus.prototype.where = function (selector) {
  return this.filter(equals(selector));
};

Dominus.prototype.is = function (selector) {
  return this.some(equals(selector));
};

Dominus.prototype.on = function (types, fn) {
  this.forEach(function (elem) {
    types.split(' ').forEach(function (type) {
      dom.on(elem, type, fn);
    });
  });
  return this;
};

Dominus.prototype.attr = function (name, value) {
  var getter = arguments.length < 2;
  var result = this.map(function (elem) {
    return getter ? dom.attr(elem, name) : dom.attr(elem, name, value);
  });
  return getter ? result[0] : this;
};

function keyValue (key, value) {
  var getter = arguments.length < 2;
  if (getter) {
    return this.length ? dom[key](this[0]) : '';
  }
  this.forEach(function (elem) {
    dom[key](elem, value);
  });
  return this;
}

function keyValueProperty (prop) {
  Dominus.prototype[prop] = function accessor (value) {
    var getter = arguments.length < 1;
    if (getter) {
      return keyValue.call(this, prop);
    }
    return keyValue.call(this, prop, value);
  };
}

['html', 'text', 'value'].forEach(keyValueProperty);

module.exports = require('./public');
