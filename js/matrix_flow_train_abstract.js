const Model = require('./matrix_flow_model.js');
const la = require('./line_alge.js');
const util = require('./util.js');
const err = util.err;
const apro = util.addPropReturnObj;
const MtrCol = la.MtrCol;

// An extension of the AbstractGradientOptimizer
// can must include a "getAlteration" function,
// which takes a MtrCol giving the gradient of 
//  
class AbstractGradientOptimizer {

	constructor(){}

	run(model, minId, idValueMap){

		(model instanceof Model) || err("Requires model.");

		//Get some constants before we do operations.
		//1. valueAcc, which takes an id and returns the matrix value
		//   of operation with that id in the latest run.
		//2. opStore, which is a map from ids to operations
		//3. parentChild, which maps from an operation id to all
		//   dependent children ids.
		//4. paramIds, which is an array of all the ids 
		//   that can be altered by the gradient
		const valueAcc = model.run([minId],idValueMap);
		const opStore = model.getOperationStore();
		const parentChild = this._getParentChildMap(opStore);
		const paramInOperation = (x) => opStore[x].type == 'Param';
		const paramIds = Object.keys(opStore).filter(paramInOperation)

		// The following is just like the code in Model, 
		// save that it will flow the other way in practice.
		//
		// Note that in the calculation, what it is doing is
		// 1) cycling over all of the children of the element
		//    whose derivative is is calculating, for each
		// 2) getting the derivative of the element with 
		//    regard to the child, then
		// 3) adding all these derivatives together to get
		//    the derivative of the element.
		var idToMtr = { [minId]: valueAcc(minId).toOne() }
		const derivAcc = (id) => {
			if (idToMtr[id] !== undefined){
				return idToMtr[id];
			}else{
				return idToMtr[id] = parentChild[id].reduce( (start, childId) => {
					const op = opStore[childId]
					const derivMtx = op.deriveWRT(childId, valueAcc, id, derivAcc)
					return start.add(derivMtx);
				}, valueAcc(id).toZero());
			}
		}
	
		// Gets the gradient of all of the paramters
		// and puts it in the gradient object, calling
		// the derivAcc function defined above.
		var gradient = {}
		paramIds.forEach( x => { 
			gradient[x] = derivAcc(x); });

		// "Delta" is how much we will change the model paramters
		// It is made by the sub-class function getAlteration,
		// which is handed a MtrCol and returns a MtrCol.
		var delta = this.getAlteration(new MtrCol(gradient)).extr();

		// Alter the parameters in opStore by delta
		var altered = util.objMap(opStore, (v, k) => {
			return (delta[k]) ? v.copy(valueAcc(k).add(delta[k])) : v;});

		// And return the modified model
		return new Model(altered, [valueAcc], parentChild );

	}

	// Given opStore, a map from operation id to operations,
	// this builds a map from operation id to the ids of 
	// children of that operation
	_getParentChildMap(opStore){
		var parentChildMap = {};
		Object.keys(opStore).forEach( (opId) => {
			opStore[opId].getParents().forEach( (parent) => {
				parentChildMap[parent] =
					(parentChildMap[parent] === undefined) ?
						[opId] : parentChildMap[parent].concat(opId);
			});
		});
		return parentChildMap
	}

}

module.exports = {
	AbstractGradientOptimizer
}