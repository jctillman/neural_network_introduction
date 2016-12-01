const Model = require('./matrix_flow_model.js');
const la = require('./line_alge.js');
const util = require('./util.js');
const err = util.err;
const apro = util.addPropReturnObj;
const MtrCol = la.MtrCol;

class AbstractGradientOptimizer {

	constructor(){}

	_getParentChildMap(operationStore){
		var parentChildMap = {};
		Object.keys(operationStore).forEach( (opId) => {
			operationStore[opId].getParents().forEach( (parent) => {
				parentChildMap[parent] =
					(parentChildMap[parent] === undefined) ?
						[opId] : parentChildMap[parent].concat(opId);
			});
		});
		return parentChildMap
	}

	run(model, minId, idValueMap){

		const valueAcc = model.run([minId],idValueMap);
		const operationStore = model.getOperationStore();
		const parentChild = this._getParentChildMap(operationStore);

		var idToMtr = { [minId]: valueAcc(minId).toOne() }

		const derivAcc = (id) => {
			if (idToMtr[id] !== undefined){
				return idToMtr[id];
			}else{
				return idToMtr[id] = parentChild[id].reduce( (start, childId) => {
					const op = operationStore[childId]
					const derivMtx = op.deriveWRT(childId, valueAcc, id, derivAcc)
					return start.add(derivMtx);
				}, valueAcc(id).toZero());
			}
		}

		Object.keys(operationStore).forEach(derivAcc);
	
		var gradient = Object.keys(idToMtr).reduce((obj, x) => {
			return (operationStore[x].type == 'Param') ?
				apro(obj,x,idToMtr[x].copy()) : obj;
		},{});

		var alteration = this.getAlteration(new MtrCol(gradient)).extr();

		var altered = util.objMap(operationStore, (op, key) => {
			return (alteration[key]) ?
				op.copy(valueAcc(key).add(alteration[key])) :
				op;
		});
		return new Model(altered, [valueAcc], parentChild );

	}

}

module.exports = {
	AbstractGradientOptimizer
}