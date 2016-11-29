#!/usr/bin/env node
const TIMING = !!process.env.TIMING;
const args = require('minimist')(process.argv.slice(2));
const file = args._[0];
const contrastConstant = args.c || 255;
const humanColors = args.h;
const outputFile = args.o;
const sharp = require('sharp');

const truncate = (value) => Math.max(Math.min(value, 255), 0);

TIMING && console.time('Loading file');

const getPixelPointer = (raw, info, x, y) => y * info.width * info.channels + x * info.channels;

const processSharp = (sharpLoad) => {

  sharpLoad
    .raw()
    .toBuffer((err, data, info) => {
      TIMING && console.timeEnd('Loading file');
      const h = info.height;
      const w = info.width;

      const F =
        (259 * (contrastConstant + 255))
        /
        (255 * (259 - contrastConstant));

      // contrast

      const colorCache = new Buffer(256);

      for (let i = 0; i < 255; i++) {
        colorCache[i] = truncate((F * (i - 128 ) + 128) | 0);
      }

      const histogram = {};

      TIMING && console.time('Calculating pixel values');

      for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
          const colorPixelPointer = getPixelPointer(data, info, j, i);
          data[colorPixelPointer + 0] = colorCache[data[colorPixelPointer + 0]]; // r
          data[colorPixelPointer + 1] = colorCache[data[colorPixelPointer + 1]]; // g
          data[colorPixelPointer + 2] = colorCache[data[colorPixelPointer + 2]]; // b

          const colorKey = humanColors ?
          'R' + data[colorPixelPointer + 0] + ' G' + data[colorPixelPointer + 1] + ' B' + data[colorPixelPointer + 2] :
            (
              data[colorPixelPointer + 0] +
              data[colorPixelPointer + 1] * Math.pow(2, 8) +
              data[colorPixelPointer + 2] * Math.pow(2, 16)
            );

          if (!histogram[colorKey]) {
            histogram[colorKey] = 0;
          }

          histogram[colorKey]++;
        }
      }
      TIMING && console.timeEnd('Calculating pixel values');

      console.log(
        JSON.stringify(
          Object.keys(histogram).map(key => [key, histogram[key], histogram[key] / (w * h)]).sort((a, b) => b[1] - a[1]),
          null,
          humanColors ? 2 : null
        )
      );

      if (outputFile) {
        sharp(data, { raw: info }).toFile(outputFile, (err) => {
          if (err) {
            console.error(err);
            process.exit(3);
          }
        });
      }
    });
};

if (file) {
  processSharp(sharp(file))
} else {
  const stdin = global.process.openStdin();

  let data = new Buffer(0);

  stdin.on('data', function(chunk) {
    data = Buffer.concat([data, new Buffer(chunk)]);
  });

  stdin.once('end', function() {
    processSharp(sharp(data));
  });
}