var prompt = require('prompt');
var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;
var fs = require('fs');
var mkdirp = require('mkdirp');
var Point = require('./lib/point');

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
            before: function (value) {
                return value.split(',');
            }
        },
        speed: {
            description: "Movement speed? (w)alk, (b)ike, (c)ar",
            type: 'string',
            required: true,
            default: "w",
            conform: function (value) {
                return _.includes(['w', 'b', 'c'], value);
            }
        }
    }
}, function (err, result) {
    var start = result.start;
    var end = result.end;
    start = _.map(start, parseFloat);
    end = _.map(end, parseFloat);
    createGpxFile(new Point(start[0], start[1]), new Point(end[0], end[1]), result.speed);
});

var createGpxFile = function (start, end, speed) {
    var pathPoints = pointsBetween(start, end, speed);
    var hoverAtEndPoints = _.map(new Array(1000), function () {
        return end.pointNearby();
    });
    var body = _.map(pathPoints, xmlEntryForPoint).join('');
    body += _.map(hoverAtEndPoints, xmlEntryForPoint).join('');

    var header = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
        <gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="mapstogpx.com" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">\n`;
    var footer = `</gpx>`;
    mkdirp('./paths');
    fs.writeFileSync('./paths/out.gpx', header + body + footer);
    console.log("Done! Path written to ./paths/out.gpx");
};

var pointsBetween = function (start, end, speed) {
    var distance = start.distanceTo(end);
    var multipliers = {
        'w': 1,
        'b': 0.5,
        'c': 0.25
    };
    var intervals = parseInt(4 / .0001733 * distance) * multipliers[speed];
    var points = [];
    for (var interval = 1; interval < intervals; interval++) {
        var lat = start.x + (end.x - start.x) * interval / intervals;
        var long = end.y + (end.y - start.y) / intervals * interval;
        var point = new Point(lat, long);
        points.push(point);
        if (interval % 2 == 0) {
            points.push(point.pointNearby());
        }
    }
    points.push(end);
    return points;
};

var xmlEntryForPoint = function (point) {
    return sprintf('<wpt lat="%s" lon="%s"></wpt>\n', point.x.toFixed(7), point.y.toFixed(7));
};