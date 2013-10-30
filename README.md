Builds functions that fit into a [chain] intended to be used with node's
`http.createServer` method.

[chain]:https://github.com/quackingduck/fun-chain

E.g.

```javascript
http.createServer(chain(
  [ dispatch('get', '/foo', serveFoo)
  , dispatch('get', '/bar', serveBar)
  , dispatch(matchesStaticFile, serveStaticFile)
  , dispatch(serveNotFound)
  ]))
```

---

"Porcelain" API:

```javascript
dispatch('get', '/foo', foo)
dispatch(matcherFn, handler)
dispatch(handler)
```

"Plumbing" API:

```javascript
dispatch.ifMatchElseNext(
    dispatch.matchers.forMethodAndPathname('get', '/foo')
  , serveFoo )

dispatch.ifMatchElseNext(
    matchesStaticFile
  , serveStaticFile )

dispatch.ifMatchElseNext(
    dispatch.matchers.any
  , serveNotFound )
```

---

Todo:

* Support sinatra-style url patterns and url "params" extraction, probably using the [path-to-regexp](https://npmjs.org/package/path-to-regexp) module
