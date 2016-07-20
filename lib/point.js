var assert = require('assert');
var _ = require('lodash');
var geolib = require('geolib');

module.exports = class Point {
    static fromString(string) {
        var values = string.split(',');
        return new Point(parseFloat(values[0]), parseFloat(values[1]));
    }

    static matchesStringFormat(string) {
        var parts = string.split(',');
        if (parts.length !== 2) {
            return false;
        }
        return !_.some(_.map(parts, parseFloat), _.curry(_.isEqual)(NaN));
    }

    constructor(lat, lon) {
        this.lat = parseFloat(lat);
        this.lon = parseFloat(lon);
    }

    pointNearby() {
        var lat = this.lat + -0.5 * 1e-6 + Math.random() * 1e-6;
        var long = this.lon + -0.5 * 1e-6 + Math.random() * 1e-6;
        return new Point(lat, long);
    }

    pointsNearby(count) {
        var me = this;
        return _.map(new Array(count), function () {
            return me.pointNearby();
        });
    };

    pointsBetween(end, speed) {
        var intervals = this.intervalsTo(end, speed);
        var points = [];
        for (var interval = 1; interval < intervals; interval++) {
            var lat = this.lat + (end.lat - this.lat) * interval / intervals;
            var long = this.lon + (end.lon - this.lon) * interval / intervals;
            points.push(new Point(lat, long).pointNearby());
        }
        return points;
    }

    pointInDirection(direction, distanceInMeters) {
        var bearing = 90 - 180 / Math.PI * Math.atan2(direction.y, direction.x);
        var latlong = geolib.computeDestinationPoint({lat: this.lat, lon: this.lon}, distanceInMeters, bearing);
        var x = parseFloat(latlong.latitude.toFixed(6));
        var y = parseFloat(latlong.longitude.toFixed(6));
        return new Point(x, y);
    }

    intervalsTo(end, speed) {
        var distance = this.distanceTo(end);
        var multipliers = {
            'w': 2,
            'b': 1,
            'c': 0.18
        };
        assert(multipliers[speed]);
        return Math.ceil(parseInt(5 / .0001733 * distance)) * multipliers[speed];
    }

    distanceTo(point) {
        return Math.sqrt(Math.pow(this.lat - point.lat, 2) + Math.pow(this.lon - point.lon, 2));
    }
};