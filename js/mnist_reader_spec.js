const expect = require("chai").expect;
const mnist = require('./mnist_reader.js');
const la = require('./line_alge.js');

describe("Has some basic mnist data", function(){

	it('Can load up some mnist data', function(){

		var oneElement = mnist.allElements()[0];
		
		//One element is an array whose first element is
		//the input, which is an array 784 long...
		expect(oneElement[0].length).to.equal(784)

		//...and whose second element is the output, which
		//is an array 10 long which will be used
		//for one-hot categorization.
		expect(oneElement[1].length).to.equal(10)
	});

	it('Can get batches of mnist data', function(){

		//@param - 0.9 -- percent of data to be training data
		//@returns -- functions to generate training and
		//				testing data.
		var [trainer, tester] = mnist.batchMakers(0.9);
		var [matIn, matOut] = trainer(50);

		expect(matIn instanceof la.Matrix).to.equal(true);
		expect(matOut instanceof la.Matrix).to.equal(true);

		expect(matIn.mx.length).to.equal(50);
		expect(matOut.mx.length).to.equal(50);
		expect(matIn.mx[0].length).to.equal(784);
		expect(matOut.mx[0].length).to.equal(10);

	});

})