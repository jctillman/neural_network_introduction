const Model = require('./matrix_flow_model.js');
const la = require('./line_alge.js');
const util = require('./util.js');
const err = util.err;

class AbstractOptimizer {

	constructor(){}

}

class GradientDescent extends AbstractOptimizer {

	constructor(lr){
		super();
		this.lr = lr
	}

	run(model, minId, givenIds, givenVals){
		var res = model.run([minId],givenIds,givenVals);
		var gradient = model.getAllParamGradients(minId);
		var changedGradients = util.objMap(gradient, (op, key) => {
			return op.piecewise( x => -x * this.lr);
		});
		return model.newAltered(changedGradients)
	}

}


class MomentumGradientDescent extends AbstractOptimizer {

	constructor(lr, momentum_decay){
		super();
		this.momentum_decay = momentum_decay;
		this.lr = lr;
		this.direction = undefined;
	}

	run(model, minId, givenIds, givenVals){
		var res = model.run([minId],givenIds,givenVals);
		var gradient = model.getAllParamGradients(minId);
		var changedGradients = util.objMap(gradient, (op, key) => {
			return op.piecewise( x => -x * this.lr);
		});

		if (this.direction == undefined){
			this.direction = util.objMap(gradient, (op) => op.piecewise( () => 0));
		}else{
			this.direction = util.objMap(this.direction, (op, key) => {
				return op.piecewise( x => x * this.momentum_decay);
			});
		}

		this.direction = util.objMap(changedGradients, (op, key) => {
			return changedGradients[key].add(this.direction[key]);
		})

		return model.newAltered(this.direction);
	}

}

class Adagrad extends AbstractOptimizer {

	constructor(lr, fudge){
		super();
		this.lr = lr
		this.fudge = fudge || 0.0001
		this.previousSquared = undefined
	}

	run(model, minId, givenIds, givenVals){
		var res = model.run([minId],givenIds,givenVals);
		var gradient = model.getAllParamGradients(minId);

		if(this.previousSquared){
			this.previousSquared = util.objMap(gradient, (op, key) => {
				return this.previousSquared[key].add(op.piecewise(x => Math.pow(x,2)))
			});
		}else{
			this.previousSquared = util.objMap(gradient, (op, key) => {
				return op.piecewise( x => Math.pow(x,2));
			})
		}

		var changedGradients = util.objMap(gradient, (op, key) => {
			var sqrtPrevReciprocal = this.previousSquared[key].piecewise(
				x => 1.0/( Math.sqrt(x) + this.fudge) );
			return op.piecewise( x => -x * this.lr).hadamard(sqrtPrevReciprocal);
		});

		return model.newAltered(changedGradients);
	}

}


module.exports = {
	AbstractOptimizer,
	GradientDescent,
	MomentumGradientDescent,
	Adagrad
}
