"use strict";

let moment  = require('moment');
let Promise = require('bluebird');
let request = require("request");
let cheerio = require('cheerio');

class CammesaAPI {

  constructor() {

    this._endpoint = 'https://aplic.cammesa.com/complemento-portal/';
    this._viewState = null;

  }

  getSources() {
    let that = this;

    return this
      ._get(`${this._endpoint}demandas.xhtml`)
      .then(function ($){
        return $('a.ui-menuitem-link[href="#"]')
          .map((i, el) => $(el).text()).get();
      })
  }

  getSeries(source) {
    return this._fetchSource(source)
      .then(function ($){
        let series = [];
        let legend = $('#leyenda').text();

        if(legend.match(/Temperatura/))
          series.push('temperature');

        if(legend.match(/Carga/))
          series.push('load');

        if(legend.match(/Demanda/))
          series.push('demand');

        return series;
      });
  }

  getDataPoints(source, series) {
    let that = this;

    return this._fetchSource(source)
      .then(function ($){
        switch(series){
          case 'load':
            return that._getLoadDataPoints($);
          case 'demand':
            return that._getDataPoints($, 'Datos Demanda', 'Dem');
          case 'temperature':
            return that._getDataPoints($, 'Datos Temperatura', 'Temp');
          default:
            throw "Invalid series";
        }
      });
  }

  _getLoadDataPoints($) {
    let legend = $('#titulo').text().trim();

    let valueMatch = legend.match(/\d+$/);

    if(!valueMatch)
      return [];

    let value = parseInt(valueMatch.shift());

    let dateStr = legend.substr(0,16);

    if(!dateStr)
      return [];

    let date = moment(dateStr, "DD/MM/YYYY hh:mm").format();

    return [{
      value: value,
      date: date
    }];
  }

  _getDataPoints($, name, prefix) {
    let that = this;
    let segments = $(`a:contains(${name})`).attr('href').split('?');

    if(segments.length == 0){
      return [];
    }

    let path = `descargar?type=xml&${segments[1]}`;

    return this._get(`${this._endpoint}${path}`)
      .then(function ($){
        var dataPoints = [];

        $('Table1').each(function (){
          let $table = $(this);

          let fecha = $table.find('Fecha_x002F_Hora').text();

          if(!fecha){
            return;
          }

          let date = moment(fecha);

          dataPoints.push(that._extractDataPoint($table, prefix + 'Hoy', date));
          dataPoints.push(that._extractDataPoint($table, prefix + 'Ayer', date, 1));
          dataPoints.push(that._extractDataPoint($table, prefix + 'SemAnt', date, 7));

        });

        return dataPoints;
      }).filter(dp => dp != null);
  }

  _extractDataPoint($table, name, date, daysAgo) {
    daysAgo = daysAgo || 0;
    let text = $table.find(name).text();

    if(!text)
      return null;

    return {
      value: parseFloat(text),
      date: date.subtract(daysAgo, 'days').format()
    }
  }

  _fetchSource(source) {
    return this
      ._get(`${this._endpoint}demandas.xhtml`)
      .then(function ($){
         var link = $('a.ui-menuitem-link[href="#"]')
          .filter((i, el) => $(el).text() == source)
          .first();

        if(link.length != 1){
          throw "Unknown Source";
        }

        return parseInt(link.attr('id').split('A').pop());
      })
      .then(function (idx){
        var j_idt4 = "j_idt4:A" + idx;

        var data = {};
        data["javax.faces.partial.ajax"] = true;
        data["javax.faces.source"] = j_idt4;
        data["javax.faces.partial.execute"] = "@all";
        data["javax.faces.partial.render"] = "j_idt4:panelUpd";
        data["j_idt4"] = "j_idt4";
        data[j_idt4] = j_idt4;

        return data
      })
      .then((data) => this._post(`${this._endpoint}demandas.xhtml`, data));
  }

  _request(options) {
    let that = this;

    return new Promise(function (resolve, reject){
      request(options, function (err, response, body){

        if (err)
          return reject(err);

        if (response.statusCode !== 200)
          return reject(response.statusMessage);

        body = body.replace(/<!\[CDATA\[([^\]]+)]\]>/ig, "$1");

        let $ = cheerio.load(body);

        let viewstate = $('input[name="javax.faces.ViewState"]').val();
        if(viewstate) {
          that._viewstate = viewstate;
        }

        resolve($);
      });
    });
  }

  _get(url) {
    return this._request({
      uri: url
    });
  }

  _post(url, data) {
    data["javax.faces.ViewState"] = this._viewstate;

    return this._request({
      uri: url,
      method: 'POST',
      form: data
    });
  }
}

module.exports = CammesaAPI;
