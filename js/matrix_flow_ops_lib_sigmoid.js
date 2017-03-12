const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const util = require('./util.js');

const Sigmoid = (a) => {
	const sigmoid = (x) => 1.0 / (1.0 + Math.exp(-x));
	const d = (x) => x * (1 - x);
	return new Operation(
		'Sigmoid', [a], () => Sigmoid(a),
		(elId, valueAcc) => valueAcc(a).piecewise(sigmoid),
		(elId, valueAcc, wrt, derivAcc) => {
			return valueAcc(elId).piecewise(d).hadamard(derivAcc(elId));
		}
	)
}

module.exports = Sigmoid