'use strict';

const jsdom = require('jsdom');
const extendInline = require('xtend/mutable');

const _document = jsdom.jsdom(undefined, {
  virtualConsole: jsdom.createVirtualConsole().sendTo(console)
});
const _window = _document.defaultView;
extendInline(global, _window);