var expect = require('chai').expect;
const VectorParser = require('../../lib/vector_parser');

describe('VectorParser', function () {
    describe('#parse()', function () {
        it('converts direction strings to vectors', function () {
            expect(VectorParser.parse('n')).to.deep.equal({x: 0, y: 1});
            expect(VectorParser.parse('s')).to.deep.equal({x: 0, y: -1});
            expect(VectorParser.parse('e')).to.deep.equal({x: 1, y: 0});
            expect(VectorParser.parse('w')).to.deep.equal({x: -1, y: 0});
            expect(VectorParser.parse('ne')).to.deep.equal({x: 1, y: 1});
            expect(VectorParser.parse('nw')).to.deep.equal({x: -1, y: 1});
            expect(VectorParser.parse('sw')).to.deep.equal({x: -1, y: -1});
            expect(VectorParser.parse('se')).to.deep.equal({x: 1, y: -1});
        });
    });
});