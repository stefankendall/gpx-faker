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

        it('should return few intervals for a short distance', function(){
            expect(validLocation1.intervalsTo(validLocation2, 'w')).to.be.lessThan(40);
            expect(validLocation1.intervalsTo(validLocation2, 'b')).to.be.lessThan(20);
            expect(validLocation1.intervalsTo(validLocation2, 'c')).to.be.lessThan(5);
        });
    });

    describe('#fromString()', function(){
       it('converts string input to point objects', function(){
            var point = Point.fromString('1.01,2.01');
           expect(point.x).to.equal(1.01);
           expect(point.y).to.equal(2.01);
       });
    });
});