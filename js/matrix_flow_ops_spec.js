const expect = require("chai").expect;
const mf = require('./matrix_flow.js');
const util = require('./util.js');
const la = require('./line_alge.js');
const Matrix = la.Matrix;

describe('Integration Testing: Cross product of operations and optimizers work', function(){

	var testOptimizer = function(optimizer_maker, optimizer_name){
		describe('All operations work with optimizer ' + optimizer_name, function(){

			var inputMatrix1 = new Matrix([[1,0,0],[0,1,0],[0,0,1]]);
			var inputMatrix2 = new Matrix([[1,1,2],[1,2,1],[2,1,1]]);
			var goalMatrix = new Matrix([[1,1,1],[1,1,1],[1,1,1]]);

			it('Can create and train model using Add', function(){

				var tr = optimizer_maker();
				var mdl = new mf.Model();
				var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
				var fst = o.Param(inputMatrix1)
				var snd = o.Param(inputMatrix2)
				var g = o.Given()

				var inter = o.Add(fst,snd);
				var goal = o.Pow(o.Sub(inter, g),2)
				
				for(var x = 0; x < 50; x++)
					mdl = tr.run(mdl, goal,{[g]: goalMatrix})

				var va = mdl.run([fst, snd],{});
				var diff = va(fst).add(va(snd));
				expect(diff.equalish(goalMatrix,0.1)).to.equal(true)
			});

			it('Can create and train model using Sub', function(){

				var tr = optimizer_maker();

				var mdl = new mf.Model();
				var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
				var fst = o.Param(inputMatrix1)
				var g = o.Given();

				var m = o.Sub(fst, g);
				var goal = o.Pow(m,2);

				for(var x = 0; x < 50; x++)
					mdl = tr.run(mdl, goal,{[g]: goalMatrix })

				var va = mdl.run([fst],{});
				expect(va(fst).equalish(goalMatrix,0.1)).to.equal(true);

			});

			it('Can create and train model using Mult', function(){

				var tr = optimizer_maker();

				var mdl = new mf.Model();
				var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
				var fst = o.Param(inputMatrix1)
				var snd = o.Param(inputMatrix2)
				var g = o.Given()

				var inter = o.Mult(fst,snd);
				var goal = o.Pow(o.Sub(g, inter),2)
				
				for(var x = 0; x < 100; x++)
					mdl = tr.run(mdl, goal,{[g]: goalMatrix})

				var va = mdl.run([fst, snd],{});
				var diff = va(fst).mult(va(snd));

				expect(diff.equalish(goalMatrix,0.05)).to.equal(true)
			});

			it('Can create and train model using AddBroadcast', function(){

				var tr = optimizer_maker();

				var mdl = new mf.Model();
				var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
				var fst = o.Param(inputMatrix1)
				var snd = o.Param(new Matrix([1,1,1]));
				var g = o.Given()

				var inter = o.AddBroadcast(fst,snd);
				var goal = o.Pow(o.Sub(g, inter),2)
				
				for(var x = 0; x < 100; x++)
					mdl = tr.run(mdl, goal,{[g]:goalMatrix})

				var va = mdl.run([fst, snd],{});
				var diff = va(fst).add_broadcast(va(snd));
				expect(diff.equalish(goalMatrix,0.05)).to.equal(true)
			});

			it('Can create and train model using ReduceSum', function(){

				var tr = optimizer_maker(); 
				var mdl = new mf.Model();
				var o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);
				var fst = o.Param(new Matrix([1,4,1]));
				var g = o.Given();
				var goalMatrix = new Matrix([2]);

				var inter = o.ReduceSum(fst);
				var goal = o.Pow(o.Sub(g, inter),2)
				
				for(var x = 0; x < 50; x++)
					mdl = tr.run(mdl, goal,{[g]: goalMatrix })

				var va = mdl.run([fst],{});
				var diff = va(fst).reduce( (x,y) => x + y, 0);

				expect(diff.equalish(goalMatrix,0.05)).to.equal(true)
			});
		})
	}

	var optimizers = [
		[() => new mf.train.GradientDescent(0.1), 'Gradient Descent'],
		[() => new mf.train.MomentumGradientDescent(0.05,0.75), 'Momentum Gradient Descent'],
		[() => new mf.train.Adagrad(0.25), "Adagrad"],
		[() => new mf.train.RMSProp(1), "RMSProp"]
	];

	optimizers.forEach(function(opt){
		testOptimizer(opt[0],opt[1]);
	})

})
