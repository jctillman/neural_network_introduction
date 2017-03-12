const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const util = require('./util.js');

const Mult = (a,b) => {
	return new Operation(
		'Mult', [a,b], () => Mult(a,b),
		(elId, valueAcc) => valueAcc(a).mult(valueAcc(b)), //N x M, M x B = N x B
		(elId, valueAcc, wrt, derivAcc) => {
			return (wrt == a) ?
				derivAcc(elId).mult(valueAcc(b).trans()) : 
				valueAcc(a).trans().mult(derivAcc(elId))
		}
	);
}

module.exports = Mult