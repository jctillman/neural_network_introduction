const Model = require('./matrix_flow_model.js');
const la = require('./line_alge.js');
const util = require('./util.js');
const MtrCol = la.MtrCol;
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
		var gradient = new MtrCol(model.getAllParamGradients(minId));
		var changedGradients = gradient.piecewise( x => -x * this.lr);
		return model.newAltered(changedGradients.extr());
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
		var gradient = new MtrCol(model.getAllParamGradients(minId));
		var changedGradients = gradient.piecewise( x => -x * this.lr);

		this.direction = (this.direction == undefined) ? 
			gradient.zero() : 
			this.direction.piecewise( x => x * this.momentum_decay);

		this.direction = this.direction.add(changedGradients)

		return model.newAltered(this.direction.extr());
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

class RMSProp extends AbstractOptimizer {

	constructor(lr, decay, fudge){
		super();
		this.lr = lr;
		this.decay = decay || 0.999;
		this.fudge = fudge || 0.0001;
		this.previousSquared = undefined
	}

	run(model, minId, givenIds, givenVals){
		var res = model.run([minId],givenIds,givenVals);
		var gradient = model.getAllParamGradients(minId);

		if(this.previousSquared){
			this.previousSquared = util.objMap(gradient, (op, key) => {
				return this.previousSquared[key].
					add(op.piecewise(x => Math.pow(x,2))).
					piecewise(x => x * this.decay);
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
	Adagrad,
	RMSProp
}
