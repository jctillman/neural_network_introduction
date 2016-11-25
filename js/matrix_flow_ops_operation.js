const util = require('./util.js');
const err = util.err;

class Operation{

	constructor(type, parents, copy, getValue, deriveWRT){

		//Go crazy with the type-checking, why not.
		(Array.isArray(parents)) || err("'Parents' must be array.")
		(typeof type == 'string') || err("'Type' must be string.")
		(typeof copy == 'function') || err("'Type' must be function.")
		(typeof getValue == 'function') || err("'getValue' must be function.")
		(typeof deriveWRT == 'function') || err("'deriveWRT' must be function.")


		this.type = type;
		this.getParents = () => parents;
		this.copy = copy,
		this.getValue = getValue;
		this.deriveWRT = (elId, valueAcc, wrt, deriveAcc) => {
			(parents.indexOf(wrt) > -1) || 
				err ("No derivative with respect to that.");
			return deriveWRT(elId, valueAcc, wrt, deriveAcc)
		}
	}

}

module.exports = Operation