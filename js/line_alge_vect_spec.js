const Vector = require('./line_alge_vect.js');
const expect = require("chai").expect;

describe('Possesses a vector abstraction with all methods', function(){

	const fst = new Vector([1,2,3]);
	const snc = new Vector([3,4,5]);
	const orth1 = new Vector([0,0,0,3]);
	const orth2 = new Vector([1,1,1,0]);

	it('Can dot-multiply two vectors', function(){
		expect(fst.dot(snc)).to.equal(26); //Basic dot product
		expect(orth1.dot(orth2)).to.equal(0); //Orthogonal vectors return zero
		const willThrow = () => orth1.dot(fst) //Throws if vectors diff
		expect(willThrow).to.throw(); 			//lengths.
	});

	it('Can add other vectors', function(){
		expect(fst.add(snc).mx).to.deep.equal([[4],[6],[8]]);
		expect(orth1.add(orth2).mx).to.deep.equal([[1],[1],[1],[3]]);
	});

	it('Can sub other vectors', function(){
		expect(fst.sub(snc).mx).to.deep.equal([[-2],[-2],[-2]]);
		expect(orth1.sub(orth2).mx).to.deep.equal([[-1],[-1],[-1],[3]]);
	});

	it('Can mult with scalars', function(){
		expect(fst.mult(2).mx).to.deep.equal([[2],[4],[6]]);
		expect(orth1.mult(3).mx).to.deep.equal([[0],[0],[0],[9]]);
	});

})
