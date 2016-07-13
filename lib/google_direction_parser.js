var _ = require('lodash');
const Point = require("./point");

module.exports = class GoogleDirectionParser {
    static parse(url) {
        return _.chain(url.split('/'))
            .map(function (part) {
                var cleaned = part.replace(/[@]/g, "");
                var commaParts = cleaned.split(',');
                if (commaParts.length > 2) {
                    cleaned = [commaParts[0], commaParts[1]].join(',');
                }
                return cleaned;
            })
            .filter(function (part) {
                return Point.matchesStringFormat(part);
            }).map(function (string) {
                return Point.fromString(string);
            }).value();
    }
};