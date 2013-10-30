module.exports = apiFn

function apiFn(/* arguments */) { return ns.dispatch.apply(ns, arguments) }

var ns = apiFn

// ---

// # Plumbing

ns.ifMatchElseNext = function(matcherFn, handlerFn) {
  return function(next, req, res) {
    matcherFn(req, function (matched) {
      if (matched) handlerFn(req, res)
      else next(req, res)
    })
  }
}

// ---

var matchers = ns.matchers = {}

matchers.any = function(req, callback) { callback(true) }

matchers.forMethodAndPathname = function(method, pathname, callback) {
  method = method.toUpperCase()
  return function(req, callback) {
    var matched =
      method    === req.method &&
      pathname  === rurl(req).pathname
    callback(matched)
  }
}

var url = require('url')

function rurl(req) {
  req._url = req._url || url.parse(req.url)
  return req._url
}

// ---

// # Porcelain

ns.dispatch = function() {
  var args = arguments
    , argc = arguments.length

  // dispatch()
  if (0 === argc) throw argErr("Bad Arguments")

  // dispatch(handler)
  if (1 === argc &&
      'function' === typeof args[0])
    return this.ifMatchElseNext(this.matchers.any, args[0])

  // dispatch(matcher, hanlder)
  if (2 === argc &&
      'function' === typeof args[0] &&
      'function' === typeof args[1])
    return this.ifMatchElseNext(args[0], args[1])

  // dispatch('get', '/foo', hanlder)
  if (3 === argc &&
      'string'   === typeof args[0] &&
      'string'   === typeof args[1] &&
      'function' === typeof args[2])
    return this.ifMatchElseNext(
        this.matchers.forMethodAndPathname(args[0], args[1])
      , args[2])

  // dispatch( * )
  throw argErr("Bad Arguments")

}

var argErr = function(msg) { return new Error(msg) }
