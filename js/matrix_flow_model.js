const util = require('./util.js');
const Matrix = require('./line_alge.js').Matrix;
const Operation = require('./matrix_flow_ops_operation.js');


// Model is a computational graph.
// You add operations to it, and
// then give it an input, and
// it applies the operations, and
// then you get an accessor for the output.
class Model{
	
	constructor(opStore = {}, valueAccs = []){
	// opStore - an object, mapping "operation id" -> an instance of Operation
	// valueAccs - an array of functions, each mapping "operation id" -> instance of Matrix
		this.opStore = opStore;
		this.valueAccs = valueAccs;
	}

	// @returns -- object mapping from operation id to operation
	getOperationStore(){ return this.opStore; }

	// @returns -- function taking operation id, and giving a matrix object
	getRecentValueAcc(){ return this.valueAccs[this.valueAccs.length-1]; }

	// opsInstance - an instance of the Operation class
	// @returns -- the operation id for the op in this.opStore
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

	// idToMtr -- an object mapping from operation id to a matrix value
	//				for that operation
	// @returns -- a function which, given an operation id, returns
	//				the matrix value for that operation.
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