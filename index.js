function createLib (execlib) {
  'use strict';

  return execlib.loadDependencies('server', ['.authentication'], require('./creator').bind(null, execlib));
}

module.exports = createLib;
