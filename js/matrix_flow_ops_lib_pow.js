const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const util = require('./util.js');

const Pow = (a,powr) => {
	const pow = (x) => Math.pow(x,powr);
	const deriver = (x) => powr * Math.pow(x,powr-1);
	return new Operation(
		'Pow', [a], () => Pow(a,powr),
		(elId, valueAcc) => valueAcc(a).piecewise(pow),
		(elId, valueAcc, wrt, derivAcc) => {
			return valueAcc(a).piecewise(deriver).hadamard(derivAcc(elId));
		}
	)
}

module.exports = Pow