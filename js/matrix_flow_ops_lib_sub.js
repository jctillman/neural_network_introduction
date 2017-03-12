const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const util = require('./util.js');

const Sub = (a,b) => {
	return new Operation(
		'Sub', [a,b], () => Sub(a,b),
		(elId, valueAcc) => valueAcc(a).sub(valueAcc(b)),
		(elId, valueAcc, wrt, derivAcc) => {
			return (wrt == a) ?
				valueAcc(a).piecewise(util.returnOne).hadamard(derivAcc(elId)) : 
				valueAcc(b).piecewise(util.returnNegOne).hadamard(derivAcc(elId));
		}
	);
}

module.exports = Sub