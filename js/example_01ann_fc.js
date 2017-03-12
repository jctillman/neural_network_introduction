const expect = require("chai").expect;
const mnist = require('./mnist_reader.js');
const mf = require('./matrix_flow.js');
const Matrix = require('./line_alge.js').Matrix

describe("Can train a basic fully connected sigmoid network", function(){

	it('Can train a basic fc sigmoid classifier', function(){

		const [trainer, tester] = mnist.batchMakers(0.9);
		const batchSize = 1;

		const tr = new mf.train.RMSProp(0.005);
		var mdl = new mf.Model();
		const o = mf.ops.util.ObjOpWrapper(mf.ops.lib, mdl);

		const input = o.Given()
		const output = o.Given()

		const w1 = o.Param(Matrix.make([784,30],() => (Math.random()-0.5)/20.00 ))
		const b1 = o.Param(Matrix.make([1,  30], () => (Math.random()-0.5)/20.00 ))
		const l1 = o.Sigmoid(o.AddBroadcastRows(o.Mult(input, w1),b1))

		const w2 = o.Param(Matrix.make([30,10], () => (Math.random()-0.5)/12.00 ))
		const b2 = o.Param(Matrix.make([1,  10], () => (Math.random()-0.5)/12.00 ))
		const l2 = o.Softmax(o.AddBroadcastRows(o.Mult(l1, w2),b2))
	
		const soft = l2

		const loss = o.ReduceSum(o.Pow(o.Sub(output,soft),2))

		var av = 1;
		for(var i = 0; i < 5000; i++){

			var [matIn, matOut] = trainer(batchSize);
			var train = {[input]: matIn, [output]: matOut }
			
			mdl = tr.run(mdl, loss, train);

			var va = mdl.run(train)
			//console.log(va(output))
			for(var x = 0; x < 28; x++){
				//console.log(
				//	va(input).
				//	mx[0].
				//	slice(x*28,x*28+28).
				//	map( (x) => Math.ceil(x)))
			}
			//console.log(va(output))
			//console.log(va(soft))

			av = av * 0.95 + va(loss).mx[0][0] * 0.05
			console.log("Av loss: " + av + "   also " + va(loss).mx[0][0]);
			//console.log("Loss: " + va(loss).mx[0][0])
		}
		
	});

})