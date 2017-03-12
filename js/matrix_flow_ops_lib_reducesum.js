const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const util = require('./util.js');

const ReduceSum = (a) => {
	return new Operation(
		'ReduceSum', [a], () => ReduceSum(a),
		(elId, valueAcc) => valueAcc(a).reduce( (x,y) => x + y, 0),
		(elId, valueAcc, wrt, derivAcc) => {
			const innerDeriv = derivAcc(elId).mx[0][0];
			return valueAcc(a).piecewise( (el) => {
				return innerDeriv;
			});
		}
	)
}

module.exports = ReduceSum