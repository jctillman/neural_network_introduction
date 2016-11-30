const expect = require("chai").expect;
const mf = require('./matrix_flow.js');
const op = mf.ops.lib;
const util = require('./util.js');
const la = require('./line_alge.js');
const Matrix = la.Matrix;



describe('Has a utility library for ops', function(){

	it('Has an ObjOpWrapper that works-1', function(){

		var mdl = new mf.Model();
		var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
		var X = o.Given([-1,1]);
		var Y = o.Given([-1,1]);
		var W = o.Param(Matrix.make([1,1], util.normal(0.1)));
		var b = o.Param(Matrix.make([1,1], util.normal(0.1)));
		var out = o.Mult(X,W);
		var out = o.AddBroadcast(o.Mult(X,W), b);
		var loss = o.ReduceSum(o.Pow(o.Sub(out, Y), 2));

		var Xval = new Matrix([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]);
		var Yval = new Matrix([2.1, 2.9, 4.0, 5.5, 5.5, 7.0, 8.2]);
		var va = mdl.run([out],[X,Y],[Xval, Yval]);
	});


	it('Has an ObjOpWrapper that works-2', function(){
		var mdl = new mf.Model();
		var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl)
		var paramMatrix = new Matrix([[1,3,2],[1,2,3]]);
		var X1 = o.Param(paramMatrix);
		var inputMatrix = new Matrix([[1,0],[0,1],[0,0]]);
		var X2 = o.Given([3,2]);
		var out = o.Mult(X1, X2);
		var va = mdl.run([out],[X2],[inputMatrix])
		expect(va(out).mx).to.deep.equal([[1,3],[1,2]])
	});


})
