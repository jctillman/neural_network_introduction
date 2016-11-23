const expect = require("chai").expect;
const mf = require('./matrix_flow.js');
const util = require('./util.js');
const la = require('./line_alge.js');
const Matrix = la.Matrix;


describe('All Operations work in it', function(){

	var inputMatrix1 = new Matrix([[1,0,0],[0,1,0],[0,0,1]]);
	var inputMatrix2 = new Matrix([[1,1,2],[1,2,1],[2,1,1]]);

	var goalMatrix = new Matrix([[1,1,1],[1,1,1],[1,1,1]]);

	it('Can create model using add', function(){
		var mdl = new mf.Model();
		var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
		var inter = o.Add(o.Param(inputMatrix1),o.Param(inputMatrix2));
		var g = o.Given()
		var goal = o.Pow(o.Sub(inter, g),2)
		var [outputMatrix] = mdl.run([goal],[g],[goalMatrix])
		//expect(outputMatrix.mx).to.deep.equal([[2,1,2],[1,3,1],[2,1,2]]);

		var tr = new mf.train.GradientDescent(0.05);
		trained = tr.run(mdl, goal,[g],[goalMatrix])
		trained = tr.run(trained, goal,[g],[goalMatrix])
		//console.log(trained)
		for(var x = 0; x < 1000; x++){
			trained = tr.run(trained, goal,[g],[goalMatrix])
		}

		console.log("TRAINED")
		var key = Object.keys(trained.opStore);
		console.log(trained.opStore[key[0]].getValue())
		console.log(trained.opStore[key[1]].getValue())
	});

})
