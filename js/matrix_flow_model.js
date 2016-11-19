const util = require('./util.js');
const Matrix = require('./line_alge.js').Matrix;

// Model creates an an object with that
// can take as input some matrix or matrixes
// and give as output some other matrix
// or matrixes.
class Model{
	
	constructor(){
		this.id = util.newId();
		this.opStore = [];
		this.valueAccs = [];
		this.parentChildMap = {};
	}

	run(idsToGet, paramIds, paramValues){

		//Take the two arrays of paramIds and turn it
		//into an object mapping from paramIds to paramValues.
		var idValueMap = paramIds.reduce(function(obj,_,i){
			 obj[paramIds[i]] = paramValues[i];
			 return obj;
		},{});

		//Accessor function passed into get value, which
		//itself either returns a cached value or 
		//calls getValue on the relevant Op.
		const valueAcc = (someId) => {
			if (idValueMap[someId] !== undefined){
				return idValueMap[someId];
			}else{
				idValueMap[someId] = this.opStore[someId].getValue(someId, valueAcc);
				return idValueMap[someId];
			}
		}

		//Finally, recursively get the values
		//for the ids we're interested in.
		var returnValue = idsToGet.map(valueAcc);

		//Save the values everywhere for use
		//in backprop and other applications.
		this.valueAccs.push(valueAcc)

		//Return them.
		return returnValue
	}

	add(opsInstance){
		
		const opId = util.newId();
		const parents = opsInstance.getParents()

		//opStore operation in operation store,
		//mapping from id to operation.
		this.opStore[opId] = opsInstance;

		//Maps from parent to child operations.
		parents.forEach( (parent) => {
			this.parentChildMap[parent] =
				(this.parentChildMap[parent] === undefined) ?
					this.parentChildMap[parent] = [opId] :
					this.parentChildMap[parent].concat(opId);
		});

		return opId;
	}

	getAllGradients(minId){

		
		const valueAcc = this.valueAccs[this.valueAccs.length-1];
		const toZero = () => 0;

		Model.isScalar(valueAcc(minId));

		var idDerivMap = {}
		idDerivMap[minId] = new Matrix([1]);

		const derivAcc = (someId) => {
			if (idDerivMap[someId] !== undefined){
				return idDerivMap[someId];
			}else{
				idDerivMap[someId] = this.parentChildMap[someId].reduce( (start, elId) => {
					const op = this.opStore[elId]
					const derivMtx = op.deriveWRT(elId, valueAcc, someId, derivAcc)
					return start.add(derivMtx);
				}, valueAcc(someId).piecewise(toZero));
				return idDerivMap[someId];
			}
		}

		Object.keys(this.opStore).forEach(derivAcc);

		Object.keys(this.opStore).forEach(x => {
			console.log(derivAcc(x))
		})



	}

	static isScalar(mtr){
		(mtr.mx[0].length == 1 && mtr.mx.length == 1) ||
			util.err("Must minimize a 1 x 1 matrix.")}


}

module.exports = Model;