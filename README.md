# Simple Queue Service

This PalmettoFlow service is a simple queue, you post documents in and you get documents out by `queue` name.

## Usage

Environment Variables

``` sh
# you can set it to use a pouchdb server instead by just giving it a name
export COUCHSVR = 'http://localhost:5984'
# database name prefix to support multiple queue services
export PREFIX = 'app_' 
# JWT_SECRET
export JWT_SECRET = 'secret here'
```

Register in Service Container

``` js
var ee = palmetto()
var svc = require('@lincs/queue-service')


svc(ee)
```

Usage in Client - Post Task to Queue

``` js
var newEvent = require('palmettoflow-event').newEvent
var ee = palmetto()

var ne = newEvent('queue', 'post', {
  queue: 'queue_name',
  ... payload ....
}, {
  token: jwtToken
})

ee.on(ne.from, function (event) {
  // handle response  
})

ee.emit('send', ne)
```

Usage in Client - Get Tasks from Queue

``` js
var newEvent = require('palmettoflow-event').newEvent
var ee = palmetto()

var ne = newEvent('queue', 'get', {
  queue: 'queue_name',
}, {
  token: jwtToken
})

ee.on(ne.from, function (event) {
  // handle response  
})

ee.emit('send', ne)
```