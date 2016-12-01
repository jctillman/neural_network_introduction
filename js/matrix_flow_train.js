const abstractOptimizers = require('./matrix_flow_train_abstract')
const AbstractGradientOptimizer = abstractOptimizers.AbstractGradientOptimizer;
const util = require('./util.js');

const err = util.err;

class MomentumGradientDescent extends AbstractGradientOptimizer {

	constructor(lr, momentum_decay){
		super();
		this.momentum_decay = momentum_decay;
		this.lr = lr;
		this.direction = undefined;
	}

	getAlteration(gradient){

		var changedGradients = gradient.piecewise( x => -x * this.lr);

		this.direction = (this.direction == undefined) ? 
			gradient.zero() : 
			this.direction.piecewise( x => x * this.momentum_decay);

		this.direction = this.direction.add(changedGradients)

		return this.direction;
	}

}

class GradientDescent extends MomentumGradientDescent {

	constructor(lr){
		super(lr, 0);
	}

}


class RMSProp extends AbstractGradientOptimizer {

	constructor(lr, decay, fudge){
		super();
		this.lr = lr;
		this.decay = decay || 0.999;
		this.fudge = fudge || 0.0001;
		this.previousSquared = undefined
	}

	getAlteration(gradient){

		this.previousSquared = (this.previousSquared !== undefined) ?
			this.previousSquared.add(gradient.pow(2)).piecewise(x => x * this.decay) : 
			gradient.pow(2);

		var sqrtPrevReciprocal = this.previousSquared.piecewise( x => {
			return 1.0 / (Math.sqrt(x) + this.fudge);
		});

		var alterAmount = gradient.piecewise(x => -x * this.lr).hadamard(sqrtPrevReciprocal)

		return alterAmount;
	}
}


class Adagrad extends RMSProp {

	constructor(lr, fudge){
		super(lr, 1, fudge);
	}

}


module.exports = {
	AbstractGradientOptimizer,
	GradientDescent,
	MomentumGradientDescent,
	Adagrad,
	RMSProp
}
