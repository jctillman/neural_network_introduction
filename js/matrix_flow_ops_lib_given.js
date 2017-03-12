const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const util = require('./util.js');

const Given = () => {
	return new Operation(
		'Given', [], () => Given(),
		(elId, valueAcc) => valAcc(elId),
		(elId, valueAcc, wrt, derivAcc) => {}
	);
}

module.exports = Given