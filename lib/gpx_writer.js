var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = class GpxWriter {
    static xmlEntryForPoint(point) {
        return sprintf('<wpt lat="%s" lon="%s"></wpt>', point.x.toFixed(7), point.y.toFixed(7));
    };

    constructor(points) {
        this.points = points;
    }

    writeTo(path) {
        var header = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
        <gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="mapstogpx.com" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">\n`;
        var footer = `</gprx>`;
        var body = _.map(this.points, GpxWriter.xmlEntryForPoint).join('\n');
        mkdirp(path);
        fs.writeFileSync(path, header + body + footer);
    }
};