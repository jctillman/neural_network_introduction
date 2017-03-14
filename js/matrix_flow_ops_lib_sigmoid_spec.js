const expect = require("chai").expect;
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const Sigmoid = require('./matrix_flow_ops_lib_sigmoid.js');
const util = require('./util.js');
const mf = require('./matrix_flow.js');

describe('Unit Testing: Matrix operation mult works', function(){

	var matrixOne = new Matrix([[-2,-1,0,1,2]]);
	//var matrixTwo = new Matrix([[1,2],[3,4],[5,6]]);
	var sigmoidUnit = Sigmoid(1);
	var valueAcc = function(a){
		return (a == 1) ? matrixOne : undefined;}
	var derivAcc = function(a){
		if (a == 0){
			return new Matrix([[-1,1],[1,-1]]);
		}
	}

	it('runs the feedforward step correctly', function(){
		var res = sigmoidUnit.getValue(0,valueAcc).mx;
		expect(res[0][2]).to.equal(0.5);
		expect(res[0][1] < 0.3).to.equal(true);
		expect(res[0][3] > 0.7).to.equal(true);
	});

	it('runs the backpropogation step correctly', function(){
		expect(multUnit.deriveWRT(0, valueAcc, 2, derivAcc).mx).
			to.deep.equal([[3,-3],[3,-3],[3,-3]]);

		expect(multUnit.deriveWRT(0, valueAcc, 1, derivAcc).mx).
			to.deep.equal([[1,1,1],[-1,-1,-1]]);
	});

	it('works with stochastic gradient descent as a whole', function(){

		var tr = new mf.train.GradientDescent(0.01)
		var mdl = new mf.Model();
		var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
		var fst = o.Param(matrixOne);
		var snd = o.Param(matrixTwo);
		var g = o.Given();

		var inter = o.Mult(fst,snd);
		var goal = o.Pow(o.Sub(g, inter),2);

		var goalMatrix = new Matrix([[1,1],[1,1]]);
		for(var x = 0; x < 20; x++){
			mdl = tr.run(mdl, goal, {[g]: goalMatrix});
		}

		var va = mdl.run({[g]: goalMatrix});

		expect(va(inter).equalish(goalMatrix,0.05)).to.equal(true)


	});
});
