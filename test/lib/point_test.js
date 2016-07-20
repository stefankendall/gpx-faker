var assert = require('chai').assert;
var expect = require('chai').expect;
var Point = require('../../lib/point');

describe('Point', function () {
    describe('#intervalsTo()', function () {
        var validLocation1 = new Point(35.9227898, -78.7626859);
        var validLocation2 = new Point(35.9226626, -78.7620167);//203ft apart
        it('should throw an exception if an unexpected speed is passed', function () {
            var threw = true;
            try {
                validLocation1.intervalsTo(validLocation2, 'q');
                threw = false;
            }
            catch (e) {
            }
            assert(threw);
        });

        it('should return few intervals for a short distance', function () {
            expect(validLocation1.intervalsTo(validLocation2, 'w')).to.be.lessThan(40);
            expect(validLocation1.intervalsTo(validLocation2, 'b')).to.be.lessThan(20);
            expect(validLocation1.intervalsTo(validLocation2, 'c')).to.be.lessThan(5);
        });
    });

    describe('#fromString()', function () {
        it('converts string input to point objects', function () {
            var point = Point.fromString('1.01,2.01');
            expect(point.lat).to.equal(1.01);
            expect(point.lon).to.equal(2.01);
        });
    });

    describe('#pointInDirection()', function () {
        it('returns a gps point in a vector direction', function () {
            var point = Point.fromString('35.718161,-77.111222');

            var endPoint = point.pointInDirection({x: 0, y: 1}, 10);
            expect(endPoint.lat).to.equal(35.718251);
            expect(endPoint.lon).to.equal(-77.111222);

            endPoint = point.pointInDirection({x: 1, y: 1}, 10);
            expect(endPoint.lat).to.equal(35.718225);
            expect(endPoint.lon).to.equal(-77.111144);

            endPoint = point.pointInDirection({x: 0, y: -1}, 1000);
            expect(endPoint.lat).to.equal(35.709178);
            expect(endPoint.lon).to.equal(-77.111222);
        });
    });

    describe('#matchesStringFormat()', function () {
        it('detects two numbers separated by a comma', function () {
            expect(Point.matchesStringFormat('1.0,-2.5')).to.equal(true);
            expect(Point.matchesStringFormat('bob,-2.5')).to.equal(false);
        });
    });
});