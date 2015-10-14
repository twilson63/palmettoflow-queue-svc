var test = require('tap').test
var rewire = require('rewire')
var palmetto = require('palmettoflow-nodejs')
var newEvent = require('palmettoflow-event').newEvent

var svc = rewire('../')
svc.__set__('jwt', {
  verify: function (token, secret, cb) {
    cb(null)
  }
})

var ee = palmetto()

svc(ee)

test('post task to queue', function (t) {
  var ne = newEvent('queue', 'post', {
    queue: 'foo',
    body: 'bar'
  }, {
    token: 'foobar'
  })
  ee.on(ne.from, function (event) {
    //console.log(event)
    t.ok(event)
    t.end()
  })
  ee.emit('send', ne)
  
})


test('get task from queue', function (t) {
  var ne = newEvent('queue', 'get', {
    queue: 'foo'
  }, {
    token: 'foobar'
  })
  ee.on(ne.from, function (event) {
    //console.log(event)
    t.ok(event)
    t.end()
  })
  ee.emit('send', ne)
})
