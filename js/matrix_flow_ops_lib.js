const Model = require('./matrix_flow_model.js');
const util = require('./util.js');
const err = util.err;

const ops = {

	Param: (initMatrix) => {
		var value = initMatrix
		return {
			getParents: () => [],
			getValue: (elemId, valAcc) => value
		};
	},

	Given: () => {
		return {
			getParents: () => [],
			getValue: (elemId, valAcc) => valAcc(elemId)
		};
	},

	Add: (a,b) => {
		return {
			getParents: () => [a,b],
			getValue: (elId, valueAcc) => valueAcc(a).add(valueAcc(b))	
		}
	},

	Sub: (a,b) => {
		return {
			getParents: () => [a,b],
			getValue: (elId, valueAcc) => valueAcc(a).sub(valueAcc(b))
		}
	},

	Mult: (a,b) => {
		return {
			getParents: () => [a,b],
			getValue: (elId, valueAcc) => valueAcc(a).mult(valueAcc(b))
		}
	},

	Add_broadcast: (a,b) => {
		return {
			getParents: () => [a,b],
			getValue: (elId, valueAcc) => {
				return valueAcc(a).add_broadcast(valueAcc(b));
			}

		}
	},

	Pow: (a,powr) => {
		const pow = (x) => Math.pow(x,powr)
		return { 
			getParents: () => [a],
			getValue: (elId, valueAcc) => {
				return valueAcc(elementId).piecewise(pow);
			}
		}
	},

	ReduceSum: (a) => {
		return { 
			getParents: () => [a],
			getValue: (elId, valueAcc) => {
				return valueAcc(a).reduce( (x,y) => x + y, 0);
			}
		}
	}

}

module.exports = ops