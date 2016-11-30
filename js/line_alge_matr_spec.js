const Matrix = require('./line_alge_matr.js');
const expect = require("chai").expect;

describe('Possesses a matrix abstraction', function(){

	const fst = new Matrix([[1,2,3],[3,2,1]]); 	 //2 x 3
	const snc = new Matrix([[0,1],[1,0],[1,0]]); //3 x 2
	const thd = new Matrix([[1,1],[1,1]]); 		 //2 x 2;

	it('Can make a matrix with or without vector shorthand', function(){
		expect(new Matrix([1,2,3,4]).mx).to.deep.equal([[1],[2],[3],[4]])
		expect(new Matrix([[1,2],[3,4]]).mx).to.deep.equal([[1,2],[3,4]])
	})

	it('Can get columns or rows from the matrix', function(){
		expect(fst.row(0)).to.deep.equal([1,2,3]);
		expect(fst.row(1)).to.deep.equal([3,2,1]);
		expect(fst.col(0)).to.deep.equal([1,3]);
		expect(fst.col(1)).to.deep.equal([2,2]);
		expect(fst.col(2)).to.deep.equal([3,1]);
	});

	it('Can transpose a matrix', function(){
		expect(fst.trans().mx).to.deep.equal([[1,3],[2,2],[3,1]]);
		expect(snc.trans().mx).to.deep.equal([[0,1,1],[1,0,0]]);
		expect(thd.trans().mx).to.deep.equal([[1,1],[1,1]]);
	});

	it('Can add a matrix to another matrix', function(){
		expect(fst.add(snc.trans()).mx).to.deep.equal([[1,3,4],[4,2,1]]);
		expect(fst.add(fst).mx).to.deep.equal([[2,4,6],[6,4,2]]);
	})

	it('Throws when matrices of incorrect dimensions are added', function(){
		var willThrow = () => fst.add(snc);
		expect(willThrow).to.throw()
	});

	it('Can add a matrix while broadcasting, i.e., a N x M and a M x 1 matrix', function(){
		expect(fst.add_broadcast(new Matrix([1,1,1])).mx).to.deep.equal([[2,3,4],[4,3,2]]); 
	});

	it('Can multiply a matrix by another matrix', function(){
		expect(thd.mult(thd).mx).to.deep.equal([[2,2],[2,2]]);
		expect(snc.mult(thd).mx).to.deep.equal([[1,1],[1,1],[1,1]]);
		expect(fst.mult(snc).mx).to.deep.equal([[5,1],[3,3]]);
		expect(snc.mult(fst).mx).to.deep.equal([[3,2,1],[1,2,3],[1,2,3]]);
	});

	it('Throws when matrices of incorrect dimensions multiplied', function(){
		var willThrow = () => fst.mult(thd)
		expect(willThrow).to.throw()
	})

})
