const util = require("./util.js")

const OpWrapper = (fnc, mdl) => {
	return function(){
		const operation = fnc.apply({}, arguments);
		return mdl.add(operation);
	}
}

const ObjOpWrapper = (paramObj, mdl) => {
	return util.objMap(paramObj, (fnc) => {
		return OpWrapper(fnc, mdl);
	});
}


module.exports = {
	ObjOpWrapper
}