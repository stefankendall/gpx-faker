var fs = require('fs');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;
var path = require('path');

module.exports = class GpxWriter {
    static xmlEntryForPoint(point) {
        return sprintf('<wpt lat="%s" lon="%s"></wpt>', point.lat.toFixed(6), point.lon.toFixed(6));
    };

    constructor(points) {
        this.points = points;
    }

    writeTo(outputPath) {
        var header = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
        <gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="mapstogpx.com" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd">\n`;
        var footer = `\n</gpx>`;
        var body = _.map(this.points, GpxWriter.xmlEntryForPoint).join('\n');
        mkdirp.sync(path.dirname(outputPath));
        fs.writeFileSync(outputPath, header + body + footer);
        console.log("Done! Path written to %s", outputPath);
    }
};