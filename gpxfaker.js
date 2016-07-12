var prompt = require('prompt');
var _ = require('lodash');
var Point = require('./lib/point');
var GpxWriter = require('./lib/gpx_writer');

var matchesLatLong = function (value) {
    return value.split(',').length === 2;
};

prompt.message = '';
prompt.get({
    properties: {
        start: {
            description: "Start <lat>,<long>",
            type: 'string',
            required: true,
            conform: matchesLatLong
        },
        end: {
            description: "End <lat>,<long>",
            type: 'string',
            required: true,
            conform: matchesLatLong
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
    createGpxFile(Point.fromString(result.start),
        Point.fromString(result.end), result.speed);
});

var createGpxFile = function (start, end, speed) {
    var pathPoints = start.pointsBetween(end, speed);
    var hoverAtEndPoints = _.map(new Array(1000), function () {
        return end.pointNearby();
    });
    var gpxWriter = new GpxWriter(_.concat(pathPoints, hoverAtEndPoints));
    gpxWriter.writeTo('./paths/out.pgx');
    console.log("Done! Path written to ./paths/out.gpx");
};