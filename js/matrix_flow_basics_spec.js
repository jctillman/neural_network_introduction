const expect = require("chai").expect;
const mf = require('./matrix_flow.js');
const o = mf.ops.lib;
const util = require('./util.js');
const la = require('./line_alge.js');
const Matrix = la.Matrix;



describe('Can make and get basic output from models', function(){

	it('Can create model, add param implicitly, and get it', function(){
		var mdl = new mf.Model();
		var inputMatrix = new Matrix([[1,3,2],[1,2,3]]);
		var X = mdl.add(o.Param(inputMatrix));
		var [outputMatrix] = mdl.run([X],[],[])
		expect(inputMatrix.mx).to.deep.equal(outputMatrix.mx);
	});


	it('Can create a model, add a given parameter, and get it', function(){
		var mdl = new mf.Model();
		var X = mdl.add(o.Given());
		var givenMatrix = new Matrix([[1,3,2],[1,2,3]]);
		var [outputMatrix] = mdl.run([X],[X],[givenMatrix])
		expect(givenMatrix.mx).to.deep.equal(outputMatrix.mx);
	});

	it('Can add a matrix to another matrix.', function(){
		var mdl = new mf.Model();
		var param1Matrix = new Matrix([[1,3,2],[1,2,3]]);
		var param2Matrix = new Matrix([[1,0,1],[0,1,1]]);
		var param1 = mdl.add(o.Param(param1Matrix))
		var param2 = mdl.add(o.Param(param2Matrix))
		var out = mdl.add(o.Add(param1, param2));
		var [outputMatrix] = mdl.run([out],[],[])
		expect(outputMatrix.mx).to.deep.equal([[2,3,3],[1,3,4]])
	});

	it('Can multiply a matrix by another matrix.', function(){
		var mdl = new mf.Model();
		var paramMatrix = new Matrix([[1,3,2],[1,2,3]]);
		var X1 = mdl.add(o.Param(paramMatrix));
		var inputMatrix = new Matrix([[1,0],[0,1],[0,0]]);
		var X2 = mdl.add(o.Given([3,2]));
		var out = mdl.add(o.Mult(X1, X2));
		var [outputMatrix] = mdl.run([out],[X2],[inputMatrix])
		expect(outputMatrix.mx).to.deep.equal([[1,3],[1,2]])
	});

	it('Can do addition, multiplication, linear model', function(){

		var mdl = new mf.Model();
		var X = mdl.add(o.Given());
		var Y = mdl.add(o.Given());
		var W = mdl.add(o.Param(Matrix.make([1,1], util.normal(0.1))));
		var b = mdl.add(o.Param(Matrix.make([1,1], util.normal(0.1))));
		var out = mdl.add(o.Mult(X,W));
		var out = mdl.add(o.AddBroadcast(mdl.add(o.Mult(X,W)), b));
		var loss = mdl.add(o.ReduceSum(mdl.add(o.Pow(mdl.add(o.Sub(out, Y)), 2))));

		var Xval = new Matrix([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]);
		var Yval = new Matrix([2.1, 2.9, 4.0, 5.5, 5.5, 7.0, 8.2]);

		results = mdl.run([out],[X,Y],[Xval, Yval]);
	});

	it ('Has a ReduceSum that works', function(){
		var mdl = new mf.Model();
		var om = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
		var X = om.Given();
		var reduced = om.ReduceSum(X);
		var inp = new Matrix([1,2,3,4,5,6]);
		var results = mdl.run([reduced],[X],[inp]);
		expect(results[0].mx[0][0]).to.equal(21)
	})

	it ('Has a AddBroadcast that works', function(){
		var mdl = new mf.Model();
		var om = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);

		var X = om.Given();
		var Y = om.Given()
		var abd = om.AddBroadcast(X,Y)

		var Xval = new Matrix([[1.0,1.0], [2.0,2.0], [3.0,3.0]]);
		var Yval = new Matrix([[2.0],[1.0]]);

		var results = mdl.run([abd],[X,Y],[Xval,Yval]);
		expect(results[0].mx).to.deep.equal([[3.0,2.0], [4.0,3.0], [5.0,4.0]])
	})

})
