const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const util = require('./util.js');

const Add = (a,b) => {
	return new Operation(
		'Add', [a,b], () => Add(a,b),
		(elId, valueAcc) => valueAcc(a).add(valueAcc(b)),
		(elId, valueAcc, wrt, derivAcc) => {
			return valueAcc(a).piecewise(util.returnOne).hadamard(derivAcc(elId));
		}
	);
}

module.exports = Add