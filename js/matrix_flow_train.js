const Model = require('./matrix_flow_model.js');
const la = require('./line_alge.js');
const util = require('./util.js');
const MtrCol = la.MtrCol;
const err = util.err;

class AbstractOptimizer {}

class MomentumGradientDescent extends AbstractOptimizer {

	constructor(lr, momentum_decay){
		super();
		this.momentum_decay = momentum_decay;
		this.lr = lr;
		this.direction = undefined;
	}

	run(model, minId, idValueMap){

		var res = model.run([minId],idValueMap);
		var gradient = new MtrCol(model.getAllParamGradients(minId));
		var changedGradients = gradient.piecewise( x => -x * this.lr);

		this.direction = (this.direction == undefined) ? 
			gradient.zero() : 
			this.direction.piecewise( x => x * this.momentum_decay);

		this.direction = this.direction.add(changedGradients)

		return model.newAltered(this.direction.extr());
	}

}

class GradientDescent extends MomentumGradientDescent {

	constructor(lr){
		super(lr, 0);
	}

}


class RMSProp extends AbstractOptimizer {

	constructor(lr, decay, fudge){
		super();
		this.lr = lr;
		this.decay = decay || 0.999;
		this.fudge = fudge || 0.0001;
		this.previousSquared = undefined
	}

	run(model, minId, idValueMap){

		var res = model.run([minId],idValueMap);
		var gradient = new MtrCol(model.getAllParamGradients(minId));

		this.previousSquared = (this.previousSquared !== undefined) ?
			this.previousSquared.add(gradient.pow(2)).piecewise(x => x * this.decay) : 
			gradient.pow(2);

		var sqrtPrevReciprocal = this.previousSquared.piecewise( x => {
			return 1.0 / (Math.sqrt(x) + this.fudge);
		});

		var alterAmount = gradient.piecewise(x => -x * this.lr).hadamard(sqrtPrevReciprocal)

		return model.newAltered(alterAmount.extr());
	}
}


class Adagrad extends RMSProp {

	constructor(lr, fudge){
		super(lr, 1, fudge);
	}

}


module.exports = {
	AbstractOptimizer,
	GradientDescent,
	MomentumGradientDescent,
	Adagrad,
	RMSProp
}
