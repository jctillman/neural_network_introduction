class Ops{

	constructor(getValue){
		this.getValue = getValue
	}

}

const Param = (initMatrix) => {
	var value = initMatrix
	return new Ops(
		(elemId, valAcc) => value
	);
}

const Given = () => {
	return new Ops(
		(elemId, valAcc) => valAcc(elemId)
	);
}

const Add = (a,b) => {
	return new Ops(
		(elId, valueAcc) => valueAcc(a).add(valueAcc(b))
	)
}

const Mult = (a,b) => {
	return new Ops(
		(elId, valueAcc) => valueAcc(a).mult(valueAcc(b))
	)
}

module.exports = {
	Param,
	Given,
	Add,
	Mult
}