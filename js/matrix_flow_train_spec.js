const expect = require("chai").expect;
const mf = require('./matrix_flow.js');
const util = require('./util.js');
const la = require('./line_alge.js');
const Matrix = la.Matrix;



describe('Can do basic gradient descent', function(){

	it('Can do really basic gradient descent', function(){

		var mdl = new mf.Model();
		var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);

		var X = o.Given();
		var W = o.Param(new Matrix([0.0,0.0,0.0]));
		var R = o.Add(X,W);

		var Y = o.Given();

		var min = o.ReduceSum(o.Sub(Y,R));		

		var Xval = new Matrix([1.0, 2.0, 3.0]);
		var Yval = new Matrix([0.0, 0.0, 0.0]);

		//var = new mf.trainers.GradientDescent()

		results = mdl.run([min],[X,Y],[Xval, Yval]);
	});


})
