# Cammesa API [![NPM version](https://badge.fury.io/js/cammesa-api.svg)](http://badge.fury.io/js/cammesa-api)

Este paquete **no oficial** contiene una herramienta de línea de comandos para consultar en tiempo real los valores de **demanda eléctrica** (en Mw), **temperatura** (en ºC) y **carga** (%) de más de 100 puntos de información provistos por *Cammesa* en su sitio web.

Tanto *temperatura* como *demanda eléctrica* suelen estar medidas a intervalos regulares durante el día actual, con información del día anterior, y en algunos casos del mismo día de la semana anterior.

En el caso de *carga* (de *trafos*) no hay información histórica disponible, y solamente se obtiene el valor de la última medición.

*Nota: azarosamente, la información se despublica del sitio por unos minutos y luego vuelve a aparecer actualizada. Sospecho que debe ser por un tema de republicación o similar, aunque de todas formas no puedo hacer nada contra ello. Hay que darle hasta que aparezca. (?)*

## Instalación

Instalar la herramienta utilizando `npm`

```
λ npm install -g cammesa
```

## API REST

Este paquete incluye una API básica, [bin/server.js](bin/server.js). Una vez instalado el paquete de manera global, puede ejecutarse la misma mediante:

```
λ cammesa-server
```

De manera predeterminada escuchará en [http://localhost:3000/](http://localhost:3000/). Hay una demo pública de la misma disponible hosteada en [now](https://zeit.co/now).

### Listado de fuentes de datos

```
λ curl https://cammesa-api-nduvhpmpcm.now.sh/
["Del SADI incluyendo Patagonia","GBA","EDELAP","EDENOR","EDESUR","Provincia de Buenos Aires","Carga TR2 de Rodriguez en %I nom.","Carga TR3 de Rodriguez en %I nom.","Carga TR4 de Rodriguez en %I nom.","Carga TR1 de Ezeiza en %I nom.","Carga TR2 de Ezeiza en %I nom.","Carga TR3 de Ezeiza en %I nom.","Carga TR1 de Abasto en %I nom.","Carga TR2 de Abasto en %I nom.","Carga TR1 de Campana en %I nom.","Carga TR2 de Campana en %I nom.","Carga TR1 de Ramallo en %I nom.","Carga TR4 de Ramallo en %I nom.","Carga TR9 de Ramallo en %I nom.","Carga TR1 de Henderson en %I nom.","Carga TR2 de Henderson e...
```

### Listado de series de datos disponibles para una fuente

```
λ curl https://cammesa-api-nduvhpmpcm.now.sh/Corrientes%20Capital
["temperature","demand"]
```

### Listado de datos disponibles para una serie

```
λ curl https://cammesa-api-nduvhpmpcm.now.sh/SADI%20sin%20Patagonia/demand
[{"value":14819.00195,"date":"2016-04-18T03:05:00+00:00"},{"value":14630.71387,"date":"2016-04-18T03:10:00+00:00"},{"value":14531.96777,"date":"2016-04-18T03:15:00+00:00"},{"value":14510.32617,"date":"2016-04-18T03:20:00+00:00"},{"value":14334.03516,"date":"2016-04-18T03:25:00+00:00"},{"value":14210.70215,"date":"2016-04-18T03:30:00+00:00"},{"value":14214.37891,"date":"2016-04-18T03:35:00+00:00"},{"value":14106.13184,"date":"2016-04-18T03:40:00+00:00"},{"value":14012.23438,"date":"2016-04-18T03:45:00+00:00"},...
```

### Docker

Hay una imagen pública de la API alojada en [Docker Hub](https://hub.docker.com/r/fcingolani/cammesa-api/):

```
λ docker run -ti -p 3000:3000 fcingolani/cammesa-api
```

### Configuración

El servidor se puede configurar mediante las siguiente variables de entorno:

| Variable | Descripción | Valor Predeterminado
|-|-|-
| `PORT` | Puerto en el que escuchará la API. | `3000`
| `CORS_ALLOWED_ORIGINS` | Lista separada por comas (sin espacios) de origins habilitados para CORS. Si no está definida, no se habilita CORS. | Sin definir.

## CLI

Instalar la herramienta utilizando `npm`

```
λ npm install -g cammesa
```

### Listar fuentes de datos

```
λ cammesa sources
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
λ cammesa series "GBA"
temperature
demand
```

### Listar datos disponibles para una serie

```
λ cammesa datapoints "GBA" demand | head
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

## Librería

A su vez este paquete expone la clase `CammesaAPI` para poder utilizada en otros programas. La misma trabaja en base de *Promises* y provee 3 métodos análogos a los que ofrece el CLI. La forma más fácil de ver cómo utilizarla es echar un vistazo al archivo [bin/cammesa.js](bin/cammesa.js)

Para hacer uso del mismo, instalarlo como dependencia mediante npm:

```
λ npm install cammesa --save
```

## Licencia

The MIT License (MIT)

Copyright (c) 2015 Federico Cingolani

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
