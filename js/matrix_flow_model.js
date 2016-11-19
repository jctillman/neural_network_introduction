const util = require('./util.js');

// Model creates an an object with that
// can take as input some matrix or matrixes
// and give as output some other matrix
// or matrixes.
class Model{
	
	constructor(){
		this.id = -1;
		this.nextRunNumber = 0;
		this.store = [];
	}

	//************************

	run(idsToGet, paramIds, paramValues){

		//Create a unique, incremental "run number" so we can
		//separate this run-through from every other.
		var thisRunNumber = this.nextRunNumber++;

		//First, just take the two arrays of paramIds and 
		//of paramValues and turn it into an object mapping
		//from paramIds to paramValues.
		var idValueMap = paramIds.reduce(function(obj,_,i){
			 obj[paramIds[i]] = paramValues[i];
			 return obj;
		},{});

		var valueAcc = (someId) => {
			if (idValueMap[someId] != undefined){
				return idValueMap[someId];
			}else{
				idValueMap[someId] = this.store[someId].getValue(someId, valueAcc);
				return idValueMap[someId];
			}
		}

		//Finally, map over the ids that we're interested in,
		//and get the values from them.  Recursion is handled
		//inside of the get_values, with the store.
		return idsToGet.map( id => {
			return this.store[id].getValue(id, valueAcc);
		});
	}

	//***********************

	add(opsInstance){
		this.id++;
		this.store.push(opsInstance);
		return this.id;
	}

}

module.exports = Model;