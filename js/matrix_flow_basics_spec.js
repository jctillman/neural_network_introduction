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
		var va = mdl.run({})
		expect(inputMatrix.mx).to.deep.equal(va(X).mx);
	});


	it('Can create a model, add a given parameter, and get it', function(){
		var mdl = new mf.Model();
		var X = mdl.add(o.Given());
		var givenMatrix = new Matrix([[1,3,2],[1,2,3]]);
		var va = mdl.run({[X]: givenMatrix })
		expect(givenMatrix.mx).to.deep.equal(va(X).mx);
	});

	it('Can add a matrix to another matrix.', function(){
		var mdl = new mf.Model();
		var param1Matrix = new Matrix([[1,3,2],[1,2,3]]);
		var param2Matrix = new Matrix([[1,0,1],[0,1,1]]);
		var param1 = mdl.add(o.Param(param1Matrix))
		var param2 = mdl.add(o.Param(param2Matrix))
		var out = mdl.add(o.Add(param1, param2));
		var va = mdl.run({})
		expect(va(out).mx).to.deep.equal([[2,3,3],[1,3,4]])
	});

	it('Can multiply a matrix by another matrix.', function(){
		var mdl = new mf.Model();
		var paramMatrix = new Matrix([[1,3,2],[1,2,3]]);
		var X1 = mdl.add(o.Param(paramMatrix));
		var inputMatrix = new Matrix([[1,0],[0,1],[0,0]]);
		var X2 = mdl.add(o.Given([3,2]));
		var out = mdl.add(o.Mult(X1, X2));
		var va = mdl.run({[X2]: inputMatrix})
		expect(va(out).mx).to.deep.equal([[1,3],[1,2]])
	});

	it ('Has a ReduceSum that works', function(){
		var mdl = new mf.Model();
		var om = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
		var X = om.Given();
		var reduced = om.ReduceSum(X);
		var inp = new Matrix([1,2,3,4,5,6]);
		var va = mdl.run({[X] :inp});
		expect(va(reduced).mx[0][0]).to.equal(21)
	});

	it ('Has a AddBroadcastCols that works', function(){
		var mdl = new mf.Model();
		var om = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);

		var X = om.Given();
		var Y = om.Given()
		var abd = om.AddBroadcastCols(X,Y)

		var Xval = new Matrix([[1.0,1.0], [2.0,2.0], [3.0,3.0]]);
		var Yval = new Matrix([[2.0],[1.0]]);

		var va = mdl.run({[X]: Xval, [Y]: Yval });
		expect(va(abd).mx).to.deep.equal([[3.0,2.0], [4.0,3.0], [5.0,4.0]])
	});

	it ('Has a AddBroadcastRows that works', function(){
		var mdl = new mf.Model();
		var om = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);

		var X = om.Given();
		var Y = om.Given()
		var abd = om.AddBroadcastRows(X,Y)

		var Xval = new Matrix([[1.0,1.0], [2.0,2.0], [3.0,3.0]]);
		var Yval = new Matrix([[2.0,1.0]]);

		var va = mdl.run({[X]: Xval, [Y]: Yval });
		expect(va(abd).mx).to.deep.equal([[3.0,2.0], [4.0,3.0], [5.0,4.0]])
	});

})
