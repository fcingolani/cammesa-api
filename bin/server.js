#! /usr/bin/env node

"use strict";

var restify = require('restify');

let CammesaAPI = require('..');

let api = new CammesaAPI;

let server = restify.createServer();

server.get('/', (req, res, next) => {
  api.getSources()
    .then( sources => res.send(sources) )
    .catch(next);
});

server.get('/:source', (req, res, next) => {
  api.getSeries(req.params.source)
    .then( series => res.send(series) )
    .catch(next);
});

server.get('/:source/:serie', (req, res, next) => {
  api.getDataPoints(req.params.source, req.params.serie)
    .call('sort', (a,b) => a.date.localeCompare(b.date) )
    .then( dataPoints => res.send(dataPoints) )
    .catch(next);
});

server.listen(process.env.port, () => {
  console.log('%s listening at %s', server.name, server.url)
});
