const Model = require('./matrix_flow_model.js');
const la = require('./line_alge.js');
const util = require('./util.js');
const apro = util.addPropReturnObj;
const MtrCol = la.MtrCol;
const err = util.err;

class AbstractOptimizer {

	constructor(){

	}

	getAllParamGradients(mdl, minId, idValueMap){

		var res = mdl.run([minId],idValueMap);

		const valueAcc = mdl.getRecentValueAcc();
		const operationStore = mdl.getOperationStore();
		const parentChild = mdl.getParentChild();

		var idToMtr = { [minId]: valueAcc(minId).toOne() }

		const derivAcc = (id) => {
			if (idToMtr[id] !== undefined){
				return idToMtr[id];
			}else{
				return idToMtr[id] = parentChild[id].reduce( (start, childId) => {
					const op = operationStore[childId]
					const derivMtx = op.deriveWRT(childId, valueAcc, id, derivAcc)
					return start.add(derivMtx);
				}, valueAcc(id).toZero());
			}
		}

		Object.keys(operationStore).forEach(derivAcc);
	
		return new MtrCol(Object.keys(idToMtr).reduce((obj, x) => {
			return (operationStore[x].type == 'Param') ?
				apro(obj,x,idToMtr[x].copy()) : obj;
		},{}));

	}

	newAltered(mdl, paramChanges){
		const opStore = mdl.getOperationStore();
		const valueAcc = mdl.getRecentValueAcc();
		var altered = util.objMap(opStore, (op, key) => {
			return (paramChanges[key]) ?
				op.copy(valueAcc(key).add(paramChanges[key])) :
				op;
		});
		return new Model(altered, [valueAcc], mdl.getParentChild() );
	}

}

class MomentumGradientDescent extends AbstractOptimizer {

	constructor(lr, momentum_decay){
		super();
		this.momentum_decay = momentum_decay;
		this.lr = lr;
		this.direction = undefined;
	}

	run(model, minId, idValueMap){

		var gradient = this.getAllParamGradients(model, minId, idValueMap);

		var changedGradients = gradient.piecewise( x => -x * this.lr);

		this.direction = (this.direction == undefined) ? 
			gradient.zero() : 
			this.direction.piecewise( x => x * this.momentum_decay);

		this.direction = this.direction.add(changedGradients)

		return this.newAltered(model, this.direction.extr());
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

		var gradient = this.getAllParamGradients(model, minId, idValueMap);

		this.previousSquared = (this.previousSquared !== undefined) ?
			this.previousSquared.add(gradient.pow(2)).piecewise(x => x * this.decay) : 
			gradient.pow(2);

		var sqrtPrevReciprocal = this.previousSquared.piecewise( x => {
			return 1.0 / (Math.sqrt(x) + this.fudge);
		});

		var alterAmount = gradient.piecewise(x => -x * this.lr).hadamard(sqrtPrevReciprocal)

		return this.newAltered(model, alterAmount.extr());
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
