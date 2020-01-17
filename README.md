<p align="center">
  <a href="https://ais.yunyoujun.cn" target="_blank" rel="noopener noreferrer"><img width="100" src="https://raw.githubusercontent.com/YunYouJun/ais.js/master/src/assets/anchor.png" alt="AIS Logo"></a>
  <h1 align="center">ais-json-english</h1>
</p>

# ais-json-english

A npm package about AIS (Automatic Identification System) text decoding.

Originally forked from <https://www.npmjs.com/package/ais-json>

Decode AIS text, then return JSON object.

npm address: <https://www.npmjs.com/package/ais-json-english>

## Structure

| Name           | Description                                                                    |
| -------------- | ------------------------------------------------------------------------------ |
| index.js       | main function (call decode.js and include verify ais text)                     |
| encode.js      | generate `ascii6bit.json` and `num2char.json`                                  |
| decode.js      | decode ais text and return json (base on `ascii6bit.json` and `num2char.json`) |
| ascii6bit.json | connect ascii to 6 bit code                                                    |
| num2char.json  | connect number to char                                                         |

# Install

```sh
npm install ais-json-english
```

# Usage

## In Terminal

```sh
npx ais '!AIVDM,1,1,,A,15Cgah00008LOnt>1Cf`s6NT00SU,0*3D'
```

Then, you will get:

```json
{
  "MessageID": {
    "name": "MessageID",
    "data": 1,
    "info": "Ship Position Report"
  },
  "DataIndicator": {
    "name": "Forward Indicator",
    "data": 0,
    "info": "Default"
  },
  "UserID": {
    "name": "UserID(MMSI)",
    "data": 356248000,
    "info": 356248000
  },
  "NaviStatus": {
    "name": "NavStatus",
    "data": 0,
    "info": "Under way using Engine"
  },
  "ROT": {
    "name": "ROT",
    "data": "0°/min",
    "info": "0°/min"
  },
  "SOG": {
    "name": "SOG",
    "data": "0 section",
    "info": "0 section"
  },
  "Accuracy": {
    "name": "Accuracy",
    "data": 0,
    "info": "High(<10m)"
  },
  "Location": {
    "name": "Coordinate",
    "data": [118.07354333333333, 24.502496666666666],
    "info": "E 118°4.4126′ , N 24°30.1498′"
  },
  "COG": {
    "name": "COG",
    "data": "228.4°",
    "info": "228.4°"
  },
  "Heading": {
    "name": "HDT",
    "data": "207°",
    "info": "207°"
  },
  "Second": {
    "name": "timestamp",
    "data": 18,
    "info": "18 seconds past the minute"
  },
  "RegionalApplication": {
    "name": "specific indicator",
    "data": 0,
    "info": "Unavailable"
  },
  "Spare": {
    "name": "spare",
    "data": 0,
    "info": "Unused"
  },
  "RAIM": {
    "name": "RAIM",
    "data": 0,
    "info": "RAIM not used"
  },
  "CommunicationState": {
    "name": "CommStatus",
    "data": "0000000100011100101",
    "info": "SOTDMA 4:57 UTC"
  },
  "text": "!AIVDM,1,1,,A,15Cgah00008LOnt>1Cf`s6NT00SU,0*3D"
}
```

## In Project

### Decode AIS Text

```sh
# const ais = require('ais-json-english')
import ais from 'ais-json-english'
let aisinfo = ais('!AIVDM,1,1,,A,15Cgah00008LOnt>1Cf`s6NT00SU,0*3D')
```

### Open SerialPort

If you need it.

[node-serialport](https://github.com/node-serialport/node-serialport)

```sh
cd ais-json-english
node serialport
```

#### Default

Port: COM3  
BaudRate: 38400

### Encode Table

```sh
cd ais-json-english
node encode
```

Generate `ascii6bit.json` and `num2char.json`.

## Intend

- [ ] CLI
