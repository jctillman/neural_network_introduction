const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const util = require('./util.js');

const Param = (initMatrix) => {
	const value = initMatrix.copy()
	return new Operation(
		'Param', [], (newMatrix) => Param(newMatrix || value),
		(elId, valueAcc) => initMatrix,
		(elId, valueAcc, wrt, derivAcc) => {}
	);
}

module.exports = Param