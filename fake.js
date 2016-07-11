var prompt = require('prompt');
var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;
var fs = require('fs');

prompt.message = '';
prompt.get({
    properties: {
        start: {
            description: "Start <lat>,<long>",
            type: 'string',
            required: true,
            before: function (value) {
                return value.split(',');
            }
        },
        end: {
            description: "End <lat>,<long>",
            type: 'string',
            required: true,
            default: "35.9165442,-78.7479476",
            before: function (value) {
                return value.split(',');
            }
        },
        intervals: {
            type: 'number',
            required: true,
            default: 100
        }
    }
}, function (err, result) {
    var start = result.start;
    var end = result.end;
    var intervals = result.intervals;
    start = _.map(start, parseFloat);
    end = _.map(end, parseFloat);
    createGpxFile(start, end, intervals);
});

var createGpxFile = function (start, end, intervals) {
    var body = pointForCoordinatePair(start);
    for (var interval = 0; interval < intervals; interval++) {
        var point = [
            (start[0] + (end[0] - start[0]) / intervals * interval).toFixed(6),
            (start[1] + (end[1] - start[1]) / intervals * interval).toFixed(6)
        ];
        body += pointForCoordinatePair(point);
    }
    body += pointForCoordinatePair(end);

    for (var i = 0; i < 1000; i++) {
        body += pointForCoordinatePair(pointAround(end));
    }

    var header = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
        <gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="mapstogpx.com" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">\n`;
    var footer = `</gpx>`;
    fs.writeFileSync('./paths/out.gpx', header + body + footer);
    console.log("Done!");
};

var pointAround = function (end) {
    return [(end[0] + -5 / 100000 + Math.random() / 10000).toFixed(6),
        (end[1] + -5 / 100000 + Math.random() / 10000).toFixed(6)];
};

var pointForCoordinatePair = function (pair) {
    return sprintf('<wpt lat="%s" lon="%s"></wpt>\n', pair[0], pair[1]);
};