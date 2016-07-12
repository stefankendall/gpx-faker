module.exports = class Point {
    constructor(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    }

    pointNearby() {
        var lat = this.x + -0.5 * 1e-5 + Math.random() * 1e-5;
        var long = this.y + -0.5 * 1e-5 + Math.random() * 1e-5;
        return new Point(lat, long);
    }

    distanceTo(point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
    }
};