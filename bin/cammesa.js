#! /usr/bin/env node

"use strict";

let program = require('commander');
let CammesaAPI = require('..');

let api = new CammesaAPI;

program
  .version('1.0.0')

program
  .command('sources')
  .description('lista todas las fuentes disponibles')
  .action(function() {
    api.getSources()
      .each(s => console.log(s))
      .catch(console.error);
  });

program
  .command('series <source_name>')
  .description('lista todas las series disponibles para una fuente')
  .action(function(source_name) {
    api.getSeries(source_name)
      .each(s => console.log(s))
      .catch(console.error);
  });

program
  .command('datapoints <source_name> <series_name>')
  .description('lista todos los datos disponibles para una serie')
  .action(function(source_name, series_name) {
    api.getDataPoints(source_name, series_name)
      .call('sort', (a,b) => a.date.localeCompare(b.date) )
      .each(dp => console.log(dp.date, dp.value))
      .catch(console.error);
  });

program
  .command('*')
  .action(function(env){
    console.error("Unknown command");
    program.help();
  });

program.parse(process.argv);

if (!program.args.length) program.help();
