const util = require('./util.js');
const Matrix = require('./line_alge.js').Matrix;
const Operation = require('./matrix_flow_ops_operation.js');
const apro = util.addPropReturnObj;


// Model is a computational graph
// You add operations to it.
// Then you give it an input,
// it applies the operations,
// and then you get an output.
class Model{
	
	// opStore - object mapping object id -> an operation
	// valueAccs - array of functions, each mapping object id -> matrix value
	constructor(opStore = {}, valueAccs = []){
		this.opStore = opStore;
		this.valueAccs = valueAccs;
	}

	getOperationStore(){ return this.opStore; }

	getRecentValueAcc(){ return this.valueAccs[this.valueAccs.length-1]; }

	// opsInstance - an instance of the Operation class
	add(opsInstance){
			
		//Should only be adding instance of "operation"
		//class to the model as members of the graph
		(opsInstance instanceof Operation) ||
			"Must only pass instance of Operation to model."

		//Generate a new id, assign the operation to it,
		//add to the parent-child map, and return the id.
		const opId = util.newId();
		this.opStore[opId] = opsInstance; 
		return opId;
	}

	run(idToMtr){

		// Accessor function passed into get value, which
		// itself either returns a cached value or 
		// calls getValue on the relevant Op.
		const ops = this.opStore;
		const valueAcc = (id) => {
			if (idToMtr[id] !== undefined){
				return idToMtr[id];
			}else{
				const tmp = ops[id].getValue(id, valueAcc);
				return idToMtr[id] = tmp;
			}
		}

		// This valueAcc for idsToGet and all upstream,
		// stores it, and returns it.
		Object.keys(idToMtr).forEach(valueAcc);
		this.valueAccs.push(valueAcc)
		return valueAcc
	}

}

module.exports = Model;