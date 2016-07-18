var expect = require('chai').expect;
var GoogleDirectionParser = require('../../lib/google_direction_parser');

describe('GoogleDirectionParser', function () {
    describe('#parse()', function () {
        it('converts a google direction string into an array of points', function () {
            var points = GoogleDirectionParser.parse("https://www.google.com/maps/dir/35.9165606,-78.7479479/35.9163012,-78.7467852/35.9114297,-78.7496088/35.9129689,-78.7518235/35.9150521,-78.7518036/35.9166567,-78.7491817/35.9165702,-78.7481377/@35.9155799,-78.7497375,17.48z/data=!4m2!4m1!3e2");
            // 35.9165606,-78.7479479
            // 35.9163012,-78.7467852
            // 35.9114297,-78.7496088
            // 35.9129689,-78.7518235
            // 35.9150521,-78.7518036
            // 35.9166567,-78.7491817
            // 35.9165702,-78.7481377
            // @35.9155799,-78.7497375
            expect(points.length).to.equal(7);
            expect(points[0].x).to.equal(35.9165606);
            expect(points[0].y).to.equal(-78.7479479);
            expect(points[6].x).to.equal(35.9165702);
        });
    });
});