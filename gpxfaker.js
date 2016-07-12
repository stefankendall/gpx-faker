var prompt = require('prompt');
var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;
var fs = require('fs');
var mkdirp = require('mkdirp');
var Point = require('./lib/point');

var matchesLatLong = function (value) {
    return value.split(',').length === 2;
};

prompt.message = '';
var convertInputToPoint = function (value) {
    var values = value.split(',');
    return new Point(parseFloat(values[0]), parseFloat(values[1]));
};
prompt.get({
    properties: {
        start: {
            description: "Start <lat>,<long>",
            type: 'string',
            required: true,
            conform: matchesLatLong,
            before: convertInputToPoint
        },
        end: {
            description: "End <lat>,<long>",
            type: 'string',
            required: true,
            conform: matchesLatLong,
            before: convertInputToPoint
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
    createGpxFile(result.start, result.end, result.speed);
});

var createGpxFile = function (start, end, speed) {
    var pathPoints = start.pointsBetween(end, speed);
    var hoverAtEndPoints = _.map(new Array(1000), function () {
        return end.pointNearby();
    });
    var body = _.map(_.concat(pathPoints, hoverAtEndPoints), xmlEntryForPoint).join('');
    var header = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
        <gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="mapstogpx.com" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">\n`;
    var footer = `</gprx>`;
    mkdirp('./paths');
    fs.writeFileSync('./paths/out.gpx', header + body + footer);
    console.log("Done! Path written to ./paths/out.gpx");
};

var xmlEntryForPoint = function (point) {
    return sprintf('<wpt lat="%s" lon="%s"></wpt>\n', point.x.toFixed(7), point.y.toFixed(7));
};