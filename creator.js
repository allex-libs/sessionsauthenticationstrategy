function createSessionsStrategyServiceMixin (execlib, AuthenticationService) {
  'use strict';

  var lib = execlib.lib,
    execSuite = execlib.execSuite,
    taskRegistry = execSuite.taskRegistry,
    RemoteAuthStrategy = AuthenticationService.prototype.strategyCtors.get('remote') ;


  function SessionsAuthStrategy (prophash) {
    RemoteAuthStrategy.call(this, prophash);
  }
  lib.inherit(SessionsAuthStrategy, RemoteAuthStrategy);
  SessionsAuthStrategy.prototype.goResolve = function(credentials,defer){
    try {
    taskRegistry.run('readFromDataSink', { sink: this.sink,
      singleshot: true,
      filter: {
        'op': 'eq',
        field: 'session',
        value: credentials.id
      },
      cb: this.onResolveSuccess.bind(this, defer),
      errorcb: this.onResolveFail.bind(this, credentials, defer)
    });
    } catch(e) {
      console.log(e);
    }
  };
  SessionsAuthStrategy.prototype.onResolveSuccess = function (defer, result) {
    if (result && result.username) {
      result.name = result.username;
    }
    return RemoteAuthStrategy.prototype.onResolveSuccess.call(this, defer, result);
  };

  AuthenticationService.prototype.strategyCtors.add('sessions', SessionsAuthStrategy);
}

module.exports = createSessionsStrategyServiceMixin;
