var dispatch = require('./')
  , test = require('tape')

test('anything matcher', function(t) {
  t.plan(1)

  dispatch.matchers.any({}, function(matched){
    t.ok(matched)
  })

})

var matcher = dispatch.matchers.forMethodAndPathname('get', '/foo')

test('matcher match', function(t) {
  t.plan(1)

  matcher(
      { method: 'GET', url: '/foo?bar=baz' }
    , function(matched){
        t.ok(matched)
      })

})

test('matcher not match (due to method)', function(t) {
  t.plan(1)

  matcher(
      { method: 'POST', url: '/foo?bar=baz' }
    , function(matched){
        t.notOk(matched)
      })

})

test('matcher not match (due to pathname)', function(t) {
  t.plan(1)

  matcher(
      { method: 'GET', url: '/foooozle?bar=baz' }
    , function(matched){
        t.notOk(matched)
      })

})

test('call hanlder when matched', function(t) {
  t.plan(2)

  var request  = { method: 'GET', url: '/foo?bar=baz' }
    , response = {}

  var handler = function(req, res) {
    t.equal(req, request)
    t.equal(res, response)
  }
  var next = function(){}

  dispatch.ifMatchElseNext(matcher, handler)(next, request, response)

})


test('call next when not matched', function(t) {
  t.plan(2)

  var request  = { method: 'POST', url: '/foo?bar=baz' }
    , response = {}

  var handler = function() { t.fail() }
  var next = function(req, res){
    t.equal(req, request)
    t.equal(res, response)
  }

  dispatch.ifMatchElseNext(matcher, handler)(next, request, response)

})

test('Porcelain API - any', function(t) {
  t.plan(1)

  var handler = function() { t.pass() }
    , next = function() { t.fail() }

  dispatch(handler)(next, {}, {})

})

test('Porcelain API - with matcher', function(t) {
  t.plan(1)

  var matcher = function(_, cb) { cb(true) }
    , handler = function() { t.pass() }
    , next = function() { t.fail() }

  dispatch(matcher, handler)(next, {}, {})

})


test('Porcelain API - method and pathname', function(t) {
  t.plan(1)

  var handler = function() { t.pass() }
    , next = function() { t.fail() }

  dispatch('get', '/foo', handler)(next, { method: 'GET', url: '/foo' }, {})

})
