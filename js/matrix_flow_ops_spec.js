const expect = require("chai").expect;
const mf = require('./matrix_flow.js');
const util = require('./util.js');
const la = require('./line_alge.js');
const Matrix = la.Matrix;


describe('All Operations work in it', function(){

	var inputMatrix1 = new Matrix([[1,0,0],[0,1,0],[0,0,1]]);
	var inputMatrix2 = new Matrix([[1,1,2],[1,2,1],[2,1,1]]);

	var goalMatrix = new Matrix([[1,1,1],[1,1,1],[1,1,1]]);


	it('Can create and train model using Add', function(){

		var mdl = new mf.Model();
		var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
		var fst = o.Param(inputMatrix1)
		var snd = o.Param(inputMatrix2)
		var g = o.Given()
		var tr = new mf.train.GradientDescent(0.05);

		var inter = o.Add(fst,snd);
		var goal = o.Pow(o.Sub(inter, g),2)

		var [outputMatrix] = mdl.run([goal],[g],[goalMatrix])
		
		for(var x = 0; x < 50; x++)
			mdl = tr.run(mdl, goal,[g],[goalMatrix])

		var [a,b] = mdl.run([fst, snd],[],[]);
		var diff = a.add(b);
		expect(diff.equalish(goalMatrix,0.1)).to.equal(true)
	});

	it('Can create and train model using Sub', function(){

		var mdl = new mf.Model();
		var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
		var fst = o.Param(inputMatrix1)
		var g = o.Given()
		var tr = new mf.train.GradientDescent(0.05);

		var m = o.Sub(fst, g);
		var goal = o.Pow(m,2);
		var [outputMatrix] = mdl.run([goal],[g],[goalMatrix])

		for(var x = 0; x < 50; x++)
			mdl = tr.run(mdl, goal,[g],[goalMatrix])

		var [a] = mdl.run([fst],[],[]);
		var diff = a.sub(goalMatrix);

		expect(a.equalish(goalMatrix,0.1)).to.equal(true)
	});

	it('Can create and train model using Mult', function(){

		var mdl = new mf.Model();
		var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
		var fst = o.Param(inputMatrix1)
		var snd = o.Param(inputMatrix2)
		var g = o.Given()
		var tr = new mf.train.GradientDescent(0.05);

		var inter = o.Mult(fst,snd);
		var goal = o.Pow(o.Sub(g, inter),2)

		var [outputMatrix] = mdl.run([goal],[g],[goalMatrix])
		
		for(var x = 0; x < 100; x++)
			mdl = tr.run(mdl, goal,[g],[goalMatrix])

		var [a,b] = mdl.run([fst, snd],[],[]);
		var diff = a.mult(b);

		expect(diff.equalish(goalMatrix,0.05)).to.equal(true)
	});

	it('Can create and train model using AddBroadCast', function(){

		var mdl = new mf.Model();
		var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
		var fst = o.Param(inputMatrix1)
		var snd = o.Param(new Matrix([1,1,1]));
		var g = o.Given()
		var tr = new mf.train.GradientDescent(0.05);

		var inter = o.AddBroadcast(fst,snd);
		var goal = o.Pow(o.Sub(g, inter),2)

		var [outputMatrix] = mdl.run([goal],[g],[goalMatrix])
		
		for(var x = 0; x < 200; x++)
			mdl = tr.run(mdl, goal,[g],[goalMatrix])

		var [a,b] = mdl.run([fst, snd],[],[]);
		var diff = a.add_broadcast(b);

		expect(diff.equalish(goalMatrix,0.05)).to.equal(true)
	});

	it('Can create and train model using ReduceSum', function(){

		var mdl = new mf.Model();
		var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
		var fst = o.Param(new Matrix([1,4,1]));
		var g = o.Given();
		var goalMatrix = new Matrix([2]);
		var tr = new mf.train.GradientDescent(0.05);

		var inter = o.ReduceSum(fst);
		var goal = o.Pow(o.Sub(g, inter),2)

		var [outputMatrix] = mdl.run([goal],[g],[goalMatrix])
		
		for(var x = 0; x < 200; x++)
			mdl = tr.run(mdl, goal,[g],[goalMatrix])

		var [a] = mdl.run([fst],[],[]);
		var diff = a.reduce( (x,y) => x + y, 0);

		expect(diff.equalish(goalMatrix,0.05)).to.equal(true)
	});


})
