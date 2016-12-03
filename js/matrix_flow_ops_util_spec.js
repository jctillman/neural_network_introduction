const expect = require("chai").expect;
const mf = require('./matrix_flow.js');
const op = mf.ops.lib;
const util = require('./util.js');
const la = require('./line_alge.js');
const Matrix = la.Matrix;

describe('Has a utility library for ops', function(){

	it('Has an ObjOpWrapper that works', function(){
		var mdl = new mf.Model();
		var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl)
		var paramMatrix = new Matrix([[1,3,2],[1,2,3]]);
		var X1 = o.Param(paramMatrix);
		var inputMatrix = new Matrix([[1,0],[0,1],[0,0]]);
		var X2 = o.Given([3,2]);
		var out = o.Mult(X1, X2);
		var va = mdl.run([out],{[X2]: inputMatrix})
		expect(va(out).mx).to.deep.equal([[1,3],[1,2]])
	});


})
