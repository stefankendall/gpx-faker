var prompt = require('prompt');
var _ = require('lodash');
var Point = require('./../lib/point');
var GpxWriter = require('./../lib/gpx_writer');

prompt.message = '';

var points = [];
var askForStart = function () {
    prompt.get({
        properties: {
            start: {
                description: "Start <lat>,<long>",
                type: 'string',
                required: true,
                conform: function (value) {
                    return Point.matchesStringFormat(value);
                }
            }
        }
    }, function (err, result) {
        var start = Point.fromString(result.start);
        for (var i = 0; i < 5; i++) {
            points.push(start.pointNearby());
        }
        askForSpeed(start);
    });
};
askForStart();

var askForSpeed = function (start) {
    prompt.get({
        properties: {
            speed: {
                description: "Movement speed? (w)alk, (b)ike, (c)ar, or (p)ause at location or (q)uit",
                type: 'string',
                required: true,
                default: "w",
                conform: function (value) {
                    return _.includes(['w', 'b', 'c', 'q'], value);
                }
            }
        }
    }, function (err, result) {
        var speed = result.speed;

        if (speed === 'q') {
            addStop(_.last(points));
            createGpxFile(points);
        }
        else if (speed === 'p') {
            addPause(_.last(points));
        }
        else {
            askForEndpoint(start, speed);
        }
    });
};

var askForEndpoint = function (start, speed) {
    prompt.get({
        properties: {
            end: {
                description: "End <lat>,<long>",
                type: 'string',
                required: true,
                conform: function (value) {
                    return Point.matchesStringFormat(value);
                }
            }
        }
    }, function (err, result) {
        var end = Point.fromString(result.end);
        var pathPoints = start.pointsBetween(end, speed);
        points = points.concat(pathPoints);
        askForSpeed(end);
    });
};

var addStop = function (point) {
    var hoverAtEndPoints = _.map(new Array(1000), function () {
        return point.pointNearby();
    });
    points = points.concat(hoverAtEndPoints);
};

var addPause = function (point) {
    var hoverAtEndPoints = _.map(new Array(40), function () {
        return point.pointNearby();
    });
    points = points.concat(hoverAtEndPoints);
};

var createGpxFile = function (points) {
    var gpxWriter = new GpxWriter(points);
    gpxWriter.writeTo('./paths/out.gpx');
    console.log("Done! Path written to ./paths/out.gpx");
};