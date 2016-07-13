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
        for (var i = 0; i < 3; i++) {
            points.push(start.pointNearby());
        }
        askForCommand(start);
    });
};

var looping = false;
var askForCommand = function (start) {
    var loopText = "(l)oop " + (looping ? "end" : "start");
    prompt.get({
        properties: {
            command: {
                description: "Command? (m)ove, (p)ause, " + loopText + " or (q)uit",
                type: 'string',
                required: true,
                default: "m",
                conform: function (value) {
                    return _.includes('mpql', value);
                }
            }
        }
    }, function (err, result) {
        var command = result.command;

        if (command === 'q') {
            addStop(_.last(points));
            createGpxFile(points);
        }
        else if (command === 'p') {
            addPause(_.last(points));
            askForCommand(start);
        }
        else if (command === 'm') {
            askForSpeed(start);
        }
        else if (command === 'l') {
            looping = !looping;
            if (looping) {
                _.last(points).loopStart = true;
                console.log("Marked loop start at %s,%s", _.last(points).x, _.last(points).y);
                askForCommand(start);
            }
            else {
                var startIndex = _.findIndex(points, 'loopStart');
                delete points[startIndex].loopStart;
                var pointsToLoop = _.slice(points, startIndex);
                prompt.get({
                    properties: {
                        loops: {
                            description: "How many times should the loop run?",
                            type: 'number',
                            required: true,
                            conform: function (value) {
                                return value > 0;
                            }
                        }
                    }
                }, function (err, result) {
                    for (var i = 0; i < result.loops; i++) {
                        points = _.concat(points, _.clone(pointsToLoop))
                    }
                    askForCommand(start);
                });
            }
        }
    });
};

var askForSpeed = function (start) {
    prompt.get({
        properties: {
            speed: {
                description: "Movement speed? (w)alk, (b)ike, or (c)ar",
                type: 'string',
                required: true,
                default: "w",
                conform: function (value) {
                    return _.includes('wbc', value);
                }
            }
        }
    }, function (err, result) {
        var speed = result.speed;
        askForEndpoint(start, speed);
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
        askForCommand(end);
    });
};

var addPointsAtEnd = function (point, count) {
    var hoverAtEndPoints = _.map(new Array(count), function () {
        return point.pointNearby();
    });
    points = points.concat(hoverAtEndPoints);
};
var addStop = _.curryRight(addPointsAtEnd)(1000);
var addPause = _.curryRight(addPointsAtEnd)(40);

var createGpxFile = function (points) {
    new GpxWriter(points).writeTo('./paths/out.gpx');
};

module.exports = {
    run: askForStart
};