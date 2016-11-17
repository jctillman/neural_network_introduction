const util = require('./util.js');

// Model creates an an object with 
//
// 1.
//
// First, it can take as input some matrix or matrixes
// and give as output some other matrix or matrixes.
//
// This corresponds with the USE of a machine learning model.
//
// 2.
//
// Second, it can take as input some matrix or matrixes
// and a correct output matrix or matrixes, and alter its
// internal parameters to approximate the input->output
// mapping.
//
// The tools meant to allow you to do this are beneath the
// "t" sub-object in the model, which stands for "train"
//
// Clearly, this corresponds to the training of an ML model.
//
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

	//***********************



	// add_broadcast(a,b){
	// 	return this._addElement(
	// 		(elId, valueAcc) => {
	// 			return valueAcc(a).add_broadcast(valueAcc(b));
	// 		}
	// 	)
	// }

	// sub(a,b){
	// 	return this._addElement(
	// 		(elId, valueAcc) => valueAcc(a).sub(valueAcc(b))
	// 	)
	// }



	// pow(a,powr){
	// 	const pow = (x) => Math.pow(x,powr)
	// 	return this._addElement( 
	// 		(elId, valueAcc) => {
	// 			return valueAcc(elementId).piecewise(pow);
	// 		}
	// 	)
	// }

	// reduce_sum(){
	// 	return this._addElement( 
	// 		(elId, valueAcc) => {
	// 			return valueAcc(elementId).reduce((x,y) => x + y);
	// 		}
	// 	)
	// }
}

module.exports = Model;