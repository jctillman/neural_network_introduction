const Model = require('./matrix_flow_model.js');
const la = require('./line_alge.js');
const util = require('./util.js');
const err = util.err;

class AbstractOptimizer {

	constructor(){}

}

class GradientDescent extends AbstractOptimizer {

	constructor(lr){
		super()
		this.lr = lr
	}

	run(model, minId, givenIds, givenVals){

		var res = model.run([minId],givenIds,givenVals)
		var gradient = model.getAllParamGradients(minId)
		var changedGradients = util.objMap(gradient, (op, key) => {
			return op.piecewise( x => -x * this.lr)
		});
		return model.newAltered(changedGradients)
	}

}


module.exports = {
	AbstractOptimizer,
	GradientDescent
}
