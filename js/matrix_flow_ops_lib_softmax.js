const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js');
const Matrix = require('./line_alge.js').Matrix;
const util = require('./util.js');

//e^x + C + e^x
//e^x * (C + e^x)^-1
//e^x * (C + e^x)^-1 + e^x * -e^x * (C + e^x)^(-2)
//(e^x * (C + e^x)^-1) * (1 - e^x * (C + e^x)^-1)

const Softmax = (a) => {
	return new Operation('SoftMax', [a], () => SoftMax(a),
		(elId, valueAcc) => {
			const inp = valueAcc(a);
			const exp = x => Math.exp(x);
			const add = (a,b) => a + b;
			const sum = inp.piecewise(exp).reduce(add,0).mx[0][0];
			return inp.piecewise(x => exp(x) / sum);
		},
		(elId, valueAcc, wrt, derivAcc) => {
			const inp = valueAcc(elId);
			const ones = inp.piecewise(util.returnOne);
			const mult = inp.hadamard(ones.sub(inp));
			return mult.hadamard(derivAcc(elId));
		}
	)
}

module.exports = Softmax