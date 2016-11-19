const Model = require('./matrix_flow_model.js');
const lib = require('./matrix_flow_ops_lib.js');
const util = require('./matrix_flow_ops_util.js');

module.exports = {
	Model,
	ops: {
		lib,
		util
	}
}