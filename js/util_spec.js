const util = require("./util.js")
const expect = require("chai").expect

describe("Includes some basic functional utility elements", function(){

	var arrOne = [1,2,3];
	var arrTwo = [2,1,1];

	it("Possesses a zipWith function, that joins two equal-length arrays", function(){
		var f = util.zipWith;
		var add = (x,y) => x + y;
		var mult = (x,y) => x * y;
		expect(f(arrOne, arrTwo, add)).to.deep.equal([3,3,4]);
		expect(f(arrOne, arrTwo, mult)).to.deep.equal([2,2,3]);
	})

	it("Possesses a sum function, that sums an array", function(){
		var arrOne = [1,2,3];
		var arrTwo = [2,1,1];
		var f = util.sum;
		expect(f(arrOne)).to.equal(6);
		expect(f(arrTwo)).to.equal(4);
	})

	it('Has object map function', function(){
		var obj = {a:1,b:2,c:3};
		var mapped = util.objMap(obj, x => x * 2);
		expect(mapped.a).to.equal(2)
		expect(mapped.b).to.equal(4)
		expect(mapped.c).to.equal(6)
	});

});
