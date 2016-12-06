const expect = require("chai").expect;
const mnist = require('./mnist_reader.js');

describe("Has some basic mnist data", function(){

	it('Can load up some mnist data in the expected format', function(){

		var all = mnist.allElements();
		console.log("!!!");
		console.log(all.length);

	})

})