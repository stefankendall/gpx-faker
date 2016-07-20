var prompt = require('prompt');
var _ = require('lodash');
var Point = require('./../lib/point');
var VectorParser = require('./../lib/vector_parser');
var GpxWriter = require('./../lib/gpx_writer');

module.exports = class Chaser {
    constructor(outputPath) {
        this.outputPath = outputPath;
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
            me.currentLocation = Point.fromString(result.start);
            me.askForNextDirection();
        });
    }

    askForNextDirection() {
        var me = this;
        prompt.get({
            properties: {
                direction: {
                    description: "Direction? (n)orth, (s)outh, (e)ast, (w)est, or ne/nw/se/sw",
                    message: "Must be exactly n, e, s, w, nw, ne, sw, or se",
                    type: 'string',
                    required: true,
                    conform: function (value) {
                        return _.includes(['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'], value);
                    }
                }
            }
        }, function (err, result) {
            me.direction = VectorParser.parse(result.direction);
            me.askForDistance();
        });
    }

    askForDistance() {
        var me = this;
        prompt.get({
            properties: {
                distance: {
                    description: "Distance to walk (in meters)?",
                    type: 'number',
                    default: 10,
                    conform: function (value) {
                        return value >= 10;
                    },
                    message: "GPS isn't quite that accurate. The minimum distance is 10m",
                    required: true
                },
                speed: {
                    description: "Movement speed? (w)alk, (b)ike, (c)ar, or (h)ighway",
                    type: 'string',
                    required: true,
                    default: "w",
                    conform: function (value) {
                        return _.includes('wbch', value);
                    }
                }
            }
        }, function (err, result) {
            var endPoint = me.currentLocation.pointInDirection(me.direction, result.distance);
            var points = me.currentLocation.pointsBetween(endPoint, result.speed);
            points = points.concat(_.last(points).pointsNearby(1000));
            new GpxWriter(points).writeTo(me.outputPath);
            me.currentLocation = endPoint;
            me.askForNextDirection();
        });
    }
};