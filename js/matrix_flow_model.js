const util = require('./util.js');
const Matrix = require('./line_alge.js').Matrix;
const Operation = require('./matrix_flow_ops_operation.js');
const apro = util.addPropReturnObj;


// Model is a computational graph
class Model{
	

	//1. opStore: object storing operations in the graph
	//2. valueAccs: array of functions mapping object to matrix values
	//3. parentChildMap: what it says on the box
	constructor(opStore, valueAccs, parentChildMap){
		this.opStore = opStore || [];
		this.valueAccs = valueAccs || [];
		this.parentChildMap = parentChildMap || {};
	}


	run(idsToGet, paramIds, paramValues){

		//Take the two arrays of paramIds and turn it
		//into an object mapping from paramIds to paramValues.
		var idValueMap = paramIds.reduce(function(obj,_,i){
			return apro(obj,paramIds[i],paramValues[i]);
		},{});

		//Accessor function passed into get value, which
		//itself either returns a cached value or 
		//calls getValue on the relevant Op.
		const valueAcc = (someId) => {
			if (idValueMap[someId] !== undefined){
				return idValueMap[someId];
			}else{
				const tmp = this.opStore[someId].getValue(someId, valueAcc);
				return idValueMap[someId] = tmp;
			}
		}

		//This both gets all of the values that were
		//asked for and populates valueAcc with the values
		//it needs to calculate anything in the graph.
		var returnValue = idsToGet.map(valueAcc);

		//Store the thus populated value acc
		this.valueAccs.push(valueAcc)

		//And return this.
		return returnValue
	}

	add(opsInstance){
			
		//Should only be adding instance of "operation"
		//class to the model as members of the graph
		(opsInstance instanceof Operation) ||
			"Must only pass instance of Operation to model."

		//Generate a new id, assign the operation to it,
		//add to the parent-child map, and return the id.
		const opId = util.newId();
		this.opStore[opId] = opsInstance;
		this.addParents(opId, opsInstance.getParents())
		return opId;
	}

	addParents(opId, parents){
		parents.forEach( (parent) => {
			this.parentChildMap[parent] =
				(this.parentChildMap[parent] === undefined) ?
					this.parentChildMap[parent] = [opId] :
					this.parentChildMap[parent].concat(opId);
		});
	}

	getAllParamGradients(minId){

		const valueAcc = this.valueAccs[this.valueAccs.length-1];

		var idDerivMap = {}
		idDerivMap[minId] = valueAcc(minId).piecewise( () => 1);

		const derivAcc = (someId) => {
			if (idDerivMap[someId] !== undefined){
				return idDerivMap[someId];
			}else{
				idDerivMap[someId] = this.parentChildMap[someId].reduce( (start, elId) => {
					const op = this.opStore[elId]
					const derivMtx = op.deriveWRT(elId, valueAcc, someId, derivAcc)
					return start.add(derivMtx);
				}, valueAcc(someId).piecewise(() => 0) );
				return idDerivMap[someId];
			}
		}

		Object.keys(this.opStore).forEach(derivAcc);
	
		return Object.keys(idDerivMap).reduce((obj, x) => {
			return (this.opStore[x].type == 'Param') ?
				apro(obj,x,idDerivMap[x].copy()) : 
				obj;
		},{});

	}

	newAltered(paramChanges){
		const valueAcc = this.valueAccs[this.valueAccs.length-1];
		var altered = util.objMap(this.opStore, (op, key) => {
			return (paramChanges[key]) ?
				op.copy(valueAcc(key).add(paramChanges[key])) :
				op;
		});
		return new Model(altered, this.valueAccs, this.parentChildMap)
	}

}

module.exports = Model;