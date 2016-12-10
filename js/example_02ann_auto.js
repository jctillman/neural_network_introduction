const expect = require("chai").expect;
const mnist = require('./mnist_reader.js');
const mf = require('./matrix_flow.js');
const Matrix = require('./line_alge.js').Matrix

describe("Can train a basic fully connected sigmoid network", function(){

	//Doesn't work at the moment.
	xit('Can train a basic fc sigmoid autoencoder', function(){

		const [trainer, tester] = mnist.batchMakers(0.9);
		const batchSize = 10;

		const tr = new mf.train.GradientDescent(0.01);
		var mdl = new mf.Model();
		const o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);

		const input = o.Given()
		const w1 = o.Param(Matrix.make([784,100],() => (Math.random()-0.5)/100.00 ))
		const l1 = o.Sigmoid(o.Mult(input, w1))
		const w2 = o.Param(Matrix.make([100,20],() => (Math.random()-0.5)/100.00 ))
		const l2 = o.Sigmoid(o.Mult(l1, w2))
		const w3 = o.Param(Matrix.make([20,100],() => (Math.random()-0.5)/100.00 ))
		const l3 = o.Sigmoid(o.Mult(l2, w3))
		const w4 = o.Param(Matrix.make([100,784],() => (Math.random()-0.5)/100.00 ))
		const l4 = o.Sigmoid(o.Mult(l3, w4))

		const loss = o.ReduceSum(o.Pow(o.Sub(input,l4),2))

		for(var i = 0; i < 20; i++){

			var [matIn, matOut] = trainer(batchSize);
			var train = {[input]: matIn}

			mdl = tr.run(mdl, loss, train);

			var va = mdl.run(train)

			console.log("Loss: " + va(loss).mx[0][0])
		}
		
	});

})