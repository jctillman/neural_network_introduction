const Model = require('./matrix_flow_model.js');
const util = require('./util.js');
const err = util.err;

const ops = {

	Param: (initMatrix) => {
		var value = initMatrix
		return {
			getValue: (elemId, valAcc) => value
		};
	},

	Given: () => {
		return {
			getValue: (elemId, valAcc) => valAcc(elemId)
		};
	},

	Add: (a,b) => {
		return {
			getValue: (elId, valueAcc) => valueAcc(a).add(valueAcc(b))
		}
	},

	Sub: (a,b) => {
		return {
			getValue: (elId, valueAcc) => valueAcc(a).sub(valueAcc(b))
		}
	},

	Mult: (a,b) => {
		return {
			getValue: (elId, valueAcc) => valueAcc(a).mult(valueAcc(b))
		}
	},

	Add_broadcast: (a,b) => {
		return {
			getValue: (elId, valueAcc) => {
				return valueAcc(a).add_broadcast(valueAcc(b));
			}
		}
	},

	Pow: (a,powr) => {
		const pow = (x) => Math.pow(x,powr)
		return { 
			getValue: (elId, valueAcc) => {
				return valueAcc(elementId).piecewise(pow);
			}
		}
	},

	Reduce_sum: () => {
		return { 
			getValue: (elId, valueAcc) => {
				return valueAcc(elementId).reduce((x,y) => x + y);
			}
		}
	}

}

module.exports = ops