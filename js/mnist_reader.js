const fs = require('fs');
const la = require('./line_alge.js');
const Matrix = la.Matrix;
const util = require('./util.js');

const loc = './small_mnist.json'

module.exports = {

	allElements: function(){
		return JSON.parse(fs.readFileSync(loc).toString());},

	batchMakers: function(trainingSize){

		const shuf = util.shuffle;
		const makerFunctionMaker = (start,stop) => {
			const num = stop - start;
			var els = shuf(this.allElements().slice(start, stop));
			var index = 0;
			return (batch) => {
				if (index + batchSize > num){
					els = shuf(this.allElements().slice(start, stop));
					index = 0;
				}
				var limitedEls = els.slice(index,index+batch);
				return [
					new Matrix(limitedEls.reduce(util.pluck(0))),
					new Matrix(limitedEls.reduce(util.pluck(1)))
				]
			}
		}

		return [
			makerFunctionMaker(0,trainingSize),
			makerFunctionMaker(trainingSize,10000)
		]
	}

}