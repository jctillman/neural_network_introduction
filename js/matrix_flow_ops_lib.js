const Model = require('./matrix_flow_model.js');
const util = require('./util.js');
const err = util.err;

const ops = {

	Param: (initMatrix) => {
		var value = initMatrix
		return {
			getParents: () => [],
			getValue: (elId, valueAcc) => value,
			deriveWRT: (elId, valueAcc, wrt, derivAcc) => {
				err("Params have zero derivative wrt anything.")
			}
		};
	},

	Given: () => {
		return {
			getParents: () => [],
			getValue: (elId, valueAcc) => valAcc(elId),
			deriveWRT: (elId, valueAcc, wrt, derivAcc) => {
				err("Params have zero derivative wrt anything.")
			}
		};
	},

	Add: (a,b) => {
		const toOne = (x) => 1;
		return {
			getParents: () => [a,b],
			getValue: (elId, valueAcc) => {
				return valueAcc(a).add(valueAcc(b))	
			},
			deriveWRT: (elId, valueAcc, wrt, derivAcc) => {
				(wrt == a || wrt == b) || err("No derivative wrt " + wrt);
				return valueAcc(a).piecewise(toOne).hadamard(derivAcc(elId));
			}
		}
	},

	Sub: (a,b) => {
		const toOne = () => 1;
		const toNegOne = () => -1;
		return {
			getParents: () => [a,b],
			getValue: (elId, valueAcc) => {
				return valueAcc(a).sub(valueAcc(b))
			},
			deriveWRT: (elId, valueAcc, wrt, derivAcc) => {
				(wrt == a || wrt == b) || err("No derivative wrt " + wrt);
				return (wrt == a) ?
					valueAcc(a).piecewise(toOne).hadamard(derivAcc(elId)) : 
					valueAcc(b).piecewise(toNegOne).hadamard(derivAcc(elId));
			}
		}
	},

	Mult: (a,b) => {
		return {
			getParents: () => [a,b],
			getValue: (elId, valueAcc) => {
				return valueAcc(a).mult(valueAcc(b))
			}
		}
	},

	AddBroadcast: (a,b) => {
		return {
			getParents: () => [a,b],
			getValue: (elId, valueAcc) => {
				return valueAcc(a).add_broadcast(valueAcc(b));
			}//,
			//deriveWRT: (wrt, valueAcc) => {
			//	(wrt == a || wrt == b) || err("No derivative wrt " + wrt);
			//	return (wrt == a) ?
			//
			//}

		}
	},

	Pow: (a,powr) => {
		const pow = (x) => Math.pow(x,powr);
		const deriver = (x) => x * Math.pow(x,power-1);
		return { 
			getParents: () => [a],
			getValue: (elId, valueAcc) => {
				return valueAcc(elId).piecewise(pow);
			},
			deriveWRT: (elId, valueAcc, wrt, derivAcc) => {
				(wrt == a) || err("No derivative wrt " + wrt);
				return valueAcc(a).piecewise(deriver).hadamard(derivAcc(elId));
			}
		}
	},

	ReduceSum: (a) => {
		const retOne = () => 1;
		return { 
			getParents: () => [a],
			getValue: (elId, valueAcc) => {
				return valueAcc(a).reduce( (x,y) => x + y, 0);
			},
			deriveWRT: (elId, valueAcc, wrt, derivAcc) => {
				(wrt == a) || err("No derivative wrt " + wrt);
				const innerDeriv = derivAcc(elId).mx[0][0];
				return valueAcc(a).piecewise( (el) => {
					return innerDeriv;
				});
			}
		}
	}

}

module.exports = ops