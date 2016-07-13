const GoogleDirectionParser = require('./../lib/google_direction_parser');
const GpxWriter = require('./../lib/gpx_writer');
var _ = require('lodash');

var convert = function (url, speed, pauses) {
    var segmentPoints = GoogleDirectionParser.parse(url);
    var points = [];
    for (var i = 0; i < segmentPoints.length - 1; i++) {
        var betweenPoints = segmentPoints[i].pointsBetween(segmentPoints[i + 1], speed);
        points = points.concat(betweenPoints);
        if (pauses) {
            points = points.concat(pointsNearby(segmentPoints[i + 1], 20));
        }
    }
    new GpxWriter(points).writeTo('./paths/out.gpx');
};

var pointsNearby = function (point, count) {
    return _.map(new Array(count), function () {
        return point.pointNearby();
    });
};

module.exports = {
    convert: convert
};