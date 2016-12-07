const fs = require('fs');
const la = require('./line_alge.js');
const Matrix = la.Matrix;
const util = require('./util.js');

const loc = './small_mnist.json'

module.exports = {

	allElements: function(){
		return JSON.parse(fs.readFileSync(loc).toString());},

	batchMakers: function(trainingProportion){

		const tp = trainingProportion;
		const shuf = util.shuffle;
		const all = this.allElements();
		const elNum = all.length;
		const trainingEls = all.slice(0, elNum*tp);
		const testingEls = all.slice(elNum*tp,elNum);

		const makerFunctionMaker = (subsect) => {
			const subsectNum = subsect.length;
			var els = shuf(subsect);
			var index = 0;
			return (batchSize) => {
				if (index + batchSize > subsectNum){
					els = shuf(subsect);
					index = 0;
				}
				var limEl = els.slice(index,index+batchSize);
				return [
					new Matrix(limEl.map(util.pluck(0))),
					new Matrix(limEl.map(util.pluck(1)))
				]
			}
		}

		return [
			makerFunctionMaker(trainingEls),
			makerFunctionMaker(testingEls)
		]
	}

}