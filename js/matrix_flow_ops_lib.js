const Model = require('./matrix_flow_model.js');
const Operation = require('./matrix_flow_ops_operation.js')
const util = require('./util.js');
const err = util.err;


const Param = (initMatrix) => {
	const value = initMatrix
	return new Operation(
		'Param', [], (newMatrix) => Param(newMatrix),
		(elId, valueAcc) => value,
		(elId, valueAcc, wrt, derivAcc) => {}
	);
}


const Given = () => {
	return new Operation(
		'Given', [], () => Given(),
		(elId, valueAcc) => valAcc(elId),
		(elId, valueAcc, wrt, derivAcc) => {}
	);
}


const Add = (a,b) => {
	return new Operation(
		'Add', [a,b], () => Add(a,b),
		(elId, valueAcc) => valueAcc(a).add(valueAcc(b)),
		(elId, valueAcc, wrt, derivAcc) => {
			return valueAcc(a).piecewise(util.returnOne).hadamard(derivAcc(elId));
		}
	);
}


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

const Mult = (a,b) => {
	return new Operation(
		'Mult', [a,b], () => Mult(a,b),
		(elId, valueAcc) => valueAcc(a).mult(valueAcc(b)),
		() => "TODO THIS NEEDS A DERIVATIVE"
	);
}


const AddBroadcast = (a,b) => {
	return new Operation(
		'AddBroadcast', [a,b], () => AddBroadcast(),
		(elId, valueAcc) => valueAcc(a).add_broadcast(valueAcc(b))
		//,
		//deriveWRT: (wrt, valueAcc) => {
		//	(wrt == a || wrt == b) || err("No derivative wrt " + wrt);
		//	return (wrt == a) ?
		//
		//}
	)
}


const Pow = (a,powr) => {
	const pow = (x) => Math.pow(x,powr);
	const deriver = (x) => x * Math.pow(x,powr-1);
	return new Operation(
		'Pow', [a], () => Pow(a,powr),
		(elId, valueAcc) => valueAcc(a).piecewise(pow),
		(elId, valueAcc, wrt, derivAcc) => {
			return valueAcc(a).piecewise(deriver).hadamard(derivAcc(elId));
		}
	)
}


const ReduceSum = (a) => {
	return new Operation(
		'ReduceSum', [a], () => ReduceSum(a),
		(elId, valueAcc) => valueAcc(a).reduce( (x,y) => x + y, 0),
		(elId, valueAcc, wrt, derivAcc) => {
			const innerDeriv = derivAcc(elId).mx[0][0];
			return valueAcc(elId).piecewise( (el) => {
				return innerDeriv;
			});
		}
	)
}


module.exports = {
	Param,
	Given,
	Add,
	Sub,
	Mult,
	AddBroadcast,
	Pow,
	ReduceSum
}