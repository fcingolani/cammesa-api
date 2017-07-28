#! /usr/bin/env node

"use strict";

var restify = require('restify');

let CammesaAPI = require('..');

let api = new CammesaAPI;

let server = restify.createServer();

const config = {
  port: process.env.PORT || process.env.port || 3000,
  corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS
};

if(config.corsAllowedOrigins){
  const corsMiddleware = require('restify-cors-middleware');

  const cors = corsMiddleware({
    origins: config.corsAllowedOrigins.split(','),
  });

  server.pre(cors.preflight);
  server.use(cors.actual);
}

server.get('/', (req, res, next) => {
  api.getSources()
    .then( sources => {
      res.send(sources);
      next();
    })
    .catch(next);
});

server.get('/:source', (req, res, next) => {
  api.getSeries(req.params.source)
    .then( series => {
      res.send(series);
      next();
    })
    .catch(next);
});

server.get('/:source/:serie', (req, res, next) => {
  api.getDataPoints(req.params.source, req.params.serie)
    .call('sort', (a,b) => a.date.localeCompare(b.date) )
    .then( dataPoints => {
      res.send(dataPoints);
      next();
    })
    .catch(next);
});

server.listen(config.port, () => {
  console.log('%s listening at %s', server.name, server.url)
});
