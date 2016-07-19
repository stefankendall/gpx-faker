var _ = require('lodash');

module.exports = class VectorParser {
    static parse(direction) {
        var vector = {x: 0, y: 0};
        if (_.includes(direction, 'n')) {
            vector.y = 1;
        }
        if (_.includes(direction, 's')) {
            vector.y = -1;
        }
        if (_.includes(direction, 'e')) {
            vector.x = 1;
        }
        if (_.includes(direction, 'w')) {
            vector.x = -1;
        }
        return vector;
    }
};