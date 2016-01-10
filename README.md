# Cammesa API [![NPM version](https://badge.fury.io/js/cammesa-api.svg)](http://badge.fury.io/js/cammesa-api)

Este paquete **no oficial** contiene una herramienta de línea de comandos para consultar en tiempo real los valores de **demanda eléctrica** (en Mw), **temperatura** (en ºC) y **carga** (%) de más de 100 puntos de información provistos por *Cammesa* en su sitio web.

Tanto *temperatura* como *demanda eléctrica* suelen estar medidas a intervalos regulares durante el día actual, con información del día anterior, y en algunos casos del mismo día de la semana anterior.

En el caso de *carga* (de *trafos*) no hay información histórica disponible, y solamente se obtiene el valor de la última medición.

*Nota: azarosamente, la información se despublica del sitio por unos minutos y luego vuelve a aparecer actualizada. Sospecho que debe ser por un tema de republicación o similar, aunque de todas formas no puedo hacer nada contra ello. Hay que darle hasta que aparezca. (?)*

## Instalación

```
npm install -g cammesa
```

## Uso

### Listar fuentes de datos

```
$ cammesa sources
Del SADI incluyendo Patagonia
GBA
EDELAP
EDENOR
EDESUR
Provincia de Buenos Aires
Carga TR2 de Rodriguez en %I nom.
Carga TR3 de Rodriguez en %I nom.
Carga TR4 de Rodriguez en %I nom.
Carga TR1 de Ezeiza en %I nom.
...
```

### Listar series de datos disponibles para una fuente

```
$ cammesa series "GBA"
temperature
demand
```

### Listar datos disponibles para una serie

```
$ cammesa datapoints "GBA" demand | head
2016-01-01T00:05:00-03:00 5974.85303
2016-01-01T00:10:00-03:00 5951.6582
2016-01-01T00:15:00-03:00 5933.30371
2016-01-01T00:20:00-03:00 5901.80176
2016-01-01T00:25:00-03:00 5871.21289
2016-01-01T00:30:00-03:00 5847.91699
2016-01-01T00:35:00-03:00 5826.35254
2016-01-01T00:40:00-03:00 5802.44873
2016-01-01T00:45:00-03:00 5779.24268
2016-01-01T00:50:00-03:00 5746.40918
...
```

## API

A su vez este paquete expone la clase `CammesaAPI` para poder utilizada en otros programas. La misma trabaja en base de *Promises* y provee 3 métodos análogos a los que ofrece el CLI. La forma más fácil de ver cómo utilizarla es echar un vistazo al archivo [bin/cammesa.js](bin/cammesa.js)

## license

The MIT License (MIT)

Copyright (c) 2015 Federico Cingolani

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
