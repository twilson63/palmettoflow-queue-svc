
var response = require('palmettoflow-event').response
var responseError = require('palmettoflow-event').responseError
var PouchDB = require('pouchdb')
//PouchDB.plugin(require('pouchdb-upsert'))

var jwt = require('jsonwebtoken')
var _ = require('underscore')

// get config
var dbUrl = process.env.COUCHSVR || 'http://admin:admin@localhost:5984'
var secret = new Buffer(process.env.JWT_SECRET || 'nosecret', 'base64')
var dbPrefix = process.env.PREFIX || 'db_'

// setup views
var db = PouchDB([dbUrl, dbPrefix + 'queue'].join('/'))
//db.putIfNotExists('_design/')

module.exports = function (ee) {
  // publish task
  ee.on('/queue/post', function (event) {
    jwt.verify(event.actor.token, secret, function (err, decoded) {
      if (err) { return ee.emit(e, responseError(event, err)) }
      db.put(event.object, [event.object.queue, (new Date()).toISOString()].join('-'))
        .then(function (result) {
          ee.emit('send', response(event, result))
        })
    })
  })

  // consume and remove tasks
  ee.on('/queue/get', function (event) {
    jwt.verify(event.actor.token, secret, function (err, decoded) {
      if (err) { return ee.emit(e, responseError(event, err)) }
      db.allDocs({
        start_key: event.queue,
        end_key: event.queue + '{}',
        include_docs: true
      })
      .then(function (results) {
        var docs = _(results.rows).pluck('doc')
        ee.emit('send', response(event, docs))
        return docs.map(function (d) { d._deleted = true; return d })
      })
      // .then(function (docs) {
      //   console.log(docs)
      //   return docs
      // })
      .then(function (docs){
        return db.bulkDocs(docs)
      })
      .then(function () {
        return db.compact()
      })
      .catch(function (err) {
        console.log(err)
      })
    })
  })
}