var assert = require('assert');

module.exports = class Point {
    static fromString(string) {
        var values = string.split(',');
        return new Point(parseFloat(values[0]), parseFloat(values[1]));
    }

    constructor(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    }

    pointNearby() {
        var lat = this.x + -0.5 * 1e-6 + Math.random() * 1e-6;
        var long = this.y + -0.5 * 1e-6 + Math.random() * 1e-6;
        return new Point(lat, long);
    }

    pointsBetween(end, speed) {
        var intervals = this.intervalsTo(end, speed);
        var points = [];
        for (var interval = 1; interval < intervals; interval++) {
            var lat = this.x + (end.x - this.x) * interval / intervals;
            var long = this.y + (end.y - this.y) * interval / intervals;
            points.push(new Point(lat, long).pointNearby());
        }
        return points;
    }

    intervalsTo(end, speed) {
        var distance = this.distanceTo(end);
        var multipliers = {
            'w': 1,
            'b': 0.5,
            'c': 0.25
        };
        assert(multipliers[speed]);
        return Math.ceil(parseInt(5 / .0001733 * distance)) * multipliers[speed];
    }

    distanceTo(point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
    }
};