var prompt = require('prompt');
var _ = require('lodash');
var Point = require('./../lib/point');
var GpxWriter = require('./../lib/gpx_writer');

module.exports = class PromptRouter {
    constructor(outputPath) {
        this.outputPath = outputPath;
        this.points = [];
        this.looping = false;
    }

    run() {
        var me = this;
        prompt.message = '';
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
                me.points.push(start.pointNearby());
            }
            me.askForCommand(start);
        });
    }

    askForCommand(start) {
        var me = this;
        var loopText = "(l)oop " + (me.looping ? "end" : "start");
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
                me.addStop(_.last(me.points));
                me.createGpxFile();
            }
            else if (command === 'p') {
                me.addPause(_.last(e.points));
                me.askForCommand(start);
            }
            else if (command === 'm') {
                me.askForSpeed(start);
            }
            else if (command === 'l') {
                me.looping = !me.looping;
                if (me.looping) {
                    _.last(me.points).loopStart = true;
                    console.log("Marked loop start at %s,%s", _.last(points).x, _.last(points).y);
                    me.askForCommand(start);
                }
                else {
                    var startIndex = _.findIndex(me.points, 'loopStart');
                    delete me.points[startIndex].loopStart;
                    var pointsToLoop = _.slice(me.points, startIndex);
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
                            me.points = _.concat(me.points, _.clone(pointsToLoop))
                        }
                        me.askForCommand(start);
                    });
                }
            }
        });
    }

    askForSpeed(start) {
        var me = this;
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
            me.askForEndpoint(start, speed);
        });
    };

    askForEndpoint(start, speed) {
        var me = this;
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
            me.points = me.points.concat(pathPoints);
            me.askForCommand(end);
        });
    };

    addPointsAtEnd(count) {
        var lastPoint = _.last(this.points);
        this.points = this.points.concat(_.map(new Array(count), function () {
            return lastPoint.pointNearby();
        }));
    };

    addStop() {
        this.addPointsAtEnd(1000);
    }

    addPause() {
        this.addPointsAtEnd(40);
    }

    createGpxFile() {
        new GpxWriter(this.points).writeTo(this.outputPath);
    };
};