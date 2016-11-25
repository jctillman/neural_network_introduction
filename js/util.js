

//PERTAINS ID / MISC THINGS ********************************
const newId = () => {
	var index = 0;
	return () => {
		index++;
		return [1,2,3,4,5,6].map( (_,i) => {
			return randEl('abcdefghijklmnopqrstuv');
		}).join('') + "" + index;
	}
}

const randEl = (str) => {
	return str[Math.floor(Math.random()*str.length)];
}


//PERTAINS TO NUMERIC STUFF **************************
const returnOne = () => 1;

const returnNegOne = () => -1;

const normal = (stdev) => {
	return () => {
		var total = -6;
		for(var x = 0; x < 12; x++){
			total = total + Math.random();
		}
		return total * stdev;
	}
}

const sum = (arr) => {
	return numericNum(arr.reduce(function(total, indiv){
		return total + indiv;
	}, 0));
}


//PERTAINS TO ERROR-CHECKING STUFF *******************
const err = (x) => {
	throw new Error(x);}

const isNumeric = (n) => {
    return Number(parseFloat(n))==n && isFinite(n);}

const numericArray = (arr) => {
	arr.forEach( (x) => {
		isNumeric(x) || err("Array element required to be numeric.")
	})
	return arr;
}

const numericNum = (num) => {
	isNumeric(num) || err("Variable required to be numeric.");
	return num
}


//PERTAINS TO UTILITY STUFF ************************
const zipWith = (arrOne, arrTwo, func) => {
	(arrOne.length == arrTwo.length) || err("Arrays must be of same length.");
	return numericArray(arrOne.map(function(_, i){
		return func(arrOne[i], arrTwo[i]);
	}));
}

const flatMap = (arr, fnc) => {
	return arr.reduce( (total, cur) => {
		return total.concat(cur);
	}, [])
}

const objMap = (obj, fnc) => {
	return Object.keys(obj).reduce( (retObj, key) => {
		retObj[key] = fnc(obj[key],key);
		return retObj;
	}, {})
}

const addPropReturnObj = (obj, prop, val) => {
	obj[prop] = val;
	return obj;
}

const ident = (x) => x;


//ACTUAL EXPORTS *******************************
module.exports = {
	newId: newId(),
	returnOne, returnNegOne, normal, sum,
	numericNum, numericArray, err,
	flatMap, zipWith, objMap, ident, addPropReturnObj	
}





