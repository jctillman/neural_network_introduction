const util = require('./util.js');
const Matrix = require('./line_alge.js').Matrix;
const Operation = require('./matrix_flow_ops_operation.js');
const apro = util.addPropReturnObj;


// Model is a computational graph
class Model{
	
	// opStore - object mapping object id -> operation itself
	// valueAccs - array of functions, each mapping object id -> matrix value
	// parentChild - object mapping object id -> object id
	constructor(opStore = [], valueAccs = [], parentChild = []){
		this.opStore = opStore;
		this.valueAccs = valueAccs;
		this.parentChild = parentChild;
	}

	getOperationStore(){ return this.opStore; }

	getRecentValueAcc(){ return this.valueAccs[this.valueAccs.length-1]; }

	getParentChild(){ return this.parentChild; }

	add(opsInstance){
			
		//Should only be adding instance of "operation"
		//class to the model as members of the graph
		(opsInstance instanceof Operation) ||
			"Must only pass instance of Operation to model."

		//Generate a new id, assign the operation to it,
		//add to the parent-child map, and return the id.
		const opId = util.newId();
		this.opStore[opId] = opsInstance;
		this._addParents(opId, opsInstance.getParents())
		return opId;
	}

	run(idsToGet, idToMtr){

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

		// This creates a working valueAcc for idsToGet
		// and for everything upstream of idsToGet, 
		// stores the thus populated value accessor,
		// and returns it.
		idsToGet.forEach(valueAcc);
		this.valueAccs.push(valueAcc)
		return valueAcc
	}

	_addParents(opId, parents){
		parents.forEach( (parent) => {
			this.parentChild[parent] =
				(this.parentChild[parent] === undefined) ?
					this.parentChild[parent] = [opId] :
					this.parentChild[parent].concat(opId);
		});
	}

}

module.exports = Model;