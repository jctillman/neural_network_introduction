const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const util = require('./util.js');

const AddBroadcastRows = (a,b) => {
	return new Operation(
		'AddBroadcastCols', [a,b], () => AddBroadcastRows(a,b),
		(elId, valueAcc) => valueAcc(a).add_broadcast_rows(valueAcc(b)),
		(elId, valueAcc, wrt, derivAcc) => {
			const d = derivAcc(elId)
			return (wrt == a) ? 
				d : (Matrix.make([1,d.mx[0].length], (row, col) => {
					return util.sum(d.col(row));
				}));
		}
	)
}

module.exports = AddBroadcastRows