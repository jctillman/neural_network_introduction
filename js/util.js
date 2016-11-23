
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

const zipWith = (arrOne, arrTwo, func) => {
	(arrOne.length == arrTwo.length) || err("Arrays must be of same length.");
	return numericArray(arrOne.map(function(_, i){
		return func(arrOne[i], arrTwo[i]);
	}));
}

const sum = (arr) => {
	return numericNum(arr.reduce(function(total, indiv){
		return total + indiv;
	}, 0));
}

const ident = (x) => x;
const returnOne = () => 1;
const returnNegOne = () => -1;

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

const normal = (stdev) => {
	return () => {
		var total = -6;
		for(var x = 0; x < 12; x++){
			total = total + Math.random();
		}
		return total * stdev;
	}
}

const randEl = (str) => {
	return str[Math.floor(Math.random()*str.length)];
}

const newId = () => {
	var index = 0;
	return () => {
		index++;
		return [1,2,3,4,5,6].map( (_,i) => {
			return randEl('abcdefghijklmnopqrstuv');
		}).join('') + "" + index;
	}
}

module.exports = {

	newId: newId(),

	returnOne, returnNegOne, normal, sum,

	numericNum, numericArray, err,
	
	flatMap,zipWith, objMap, ident		
}





