const expect = require("chai").expect;
const mnist = require('./mnist_reader.js');
const mf = require('./matrix_flow.js');
const Matrix = require('./line_alge.js').Matrix

describe("Can train a basic fully connected sigmoid network", function(){

	it('Can train a basic fc sigmoid classifier', function(){

		const [trainer, tester] = mnist.batchMakers(0.9);
		const batchSize = 25;

		const tr = new mf.train.GradientDescent(0.01);
		var mdl = new mf.Model();
		const o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);

		const input = o.Given()
		const output = o.Given()

		const w1 = o.Param(Matrix.make([784,100],() => (Math.random()-0.5)/100.00 ))
		const b1 = o.Param(Matrix.make([1,  100], () => (Math.random()-0.5)/100.00 ))
		const l1 = o.Sigmoid(o.AddBroadcastRows(o.Mult(input, w1),b1))

		const w2 = o.Param(Matrix.make([100,10], () => (Math.random()-0.5)/100.00 ))
		const b2 = o.Param(Matrix.make([1,  10], () => (Math.random()-0.5)/100.00 ))
		const l2 = o.Sigmoid(o.AddBroadcastRows(o.Mult(l1, w2),b2))

		const loss = o.ReduceSum(o.Pow(o.Sub(output,l2),2))

		for(var i = 0; i < 30; i++){

			var [matIn, matOut] = trainer(batchSize);
			var train = {[input]: matIn, [output]: matOut }

			mdl = tr.run(mdl, loss, train);

			var va = mdl.run(train)

			console.log("Loss: " + va(loss).mx[0][0])
		}
		
	});

})