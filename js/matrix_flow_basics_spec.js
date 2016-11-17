const expect = require("chai").expect;
const mf = require('./matrix_flow.js');
const ops = mf.ops;
const util = require('./util.js');
const la = require('./line_alge.js');
const Matrix = la.Matrix;



describe('Can make and get basic output from models', function(){

	it('Can create model, add given, and get it', function(){
		var mdl = new mf.Model();
		var X = mdl.add(ops.Param([10,30]));
		var inputMatrix = new Matrix([[1,3,2],[1,2,3]]);
		var [outputMatrix] = mdl.run([X],[X],[inputMatrix])
		expect(inputMatrix.mx).to.deep.equal(outputMatrix.mx);
	});

	// it('Can create a model, add parameter, and get it', function(){
	// 	var mdl = new mf.Model();
	// 	var paramMatrix = new Matrix([[1,3,2],[1,2,3]]);
	// 	var X = mdl.param(paramMatrix);
	// 	var [outputMatrix] = mdl.run([X],[],[])
	// 	expect(paramMatrix.mx).to.deep.equal(outputMatrix.mx);
	// });

	// it('Can add a matrix to another matrix.', function(){
	// 	var mdl = new mf.Model();
	// 	var param1Matrix = new Matrix([[1,3,2],[1,2,3]]);
	// 	var param2Matrix = new Matrix([[1,0,1],[0,1,1]]);
	// 	var param1 = mdl.param(param1Matrix)
	// 	var param2 = mdl.param(param2Matrix)
	// 	var out = mdl.add(param1, param2);
	// 	var [outputMatrix] = mdl.run([out],[],[])
	// 	expect(outputMatrix.mx).to.deep.equal([[2,3,3],[1,3,4]])
	// });

	// it('Can multiply a matrix by another matrix.', function(){
	// 	var mdl = new mf.Model();
	// 	var paramMatrix = new Matrix([[1,3,2],[1,2,3]]);
	// 	var X1 = mdl.param(paramMatrix);
	// 	var inputMatrix = new Matrix([[1,0],[0,1],[0,0]]);
	// 	var X2 = mdl.given([3,2]);
	// 	var out = mdl.mult(X1, X2);
	// 	var [outputMatrix] = mdl.run([out],[X2],[inputMatrix])
	// 	expect(outputMatrix.mx).to.deep.equal([[1,3],[1,2]])
	// });

	// it('Can do addition, multiplication, linear model', function(){

	// 	var mdl = new mf.Model();
	// 	var X = mdl.given([-1,1]);
	// 	var Y = mdl.given([-1,1]);
	// 	var W = mdl.param(Matrix.make([1,1], util.normal(0.1)));
	// 	var b = mdl.param(Matrix.make([1,1], util.normal(0.1)));
	// 	var out = mdl.mult(X,W);
	// 	var out = mdl.add_broadcast(mdl.mult(X,W), b); //NEED BROADCASTING.
	// 	var loss = mdl.reduce_sum(mdl.pow(mdl.sub(out, Y), 2));

	// 	var Xval = new Matrix([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]);
	// 	var Yval = new Matrix([2.1, 2.9, 4.0, 5.5, 5.5, 7.0, 8.2]);

	// 	results = mdl.run([out],[X,Y],[Xval, Yval]);


	// });



})
