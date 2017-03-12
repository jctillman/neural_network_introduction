const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const util = require('./util.js');

const AddBroadcastCols = (a,b) => {
	return new Operation(
		'AddBroadcastCols', [a,b], () => AddBroadcastCols(a,b),
		(elId, valueAcc) => valueAcc(a).add_broadcast_cols(valueAcc(b)),
		(elId, valueAcc, wrt, derivAcc) => {
			const d = derivAcc(elId)
			return (wrt == a) ? d : Matrix.make([d.mx.length,1], (row, col) => {
					return util.sum(d.col(row));
				});
		}
	)
}

module.exports = AddBroadcastCols