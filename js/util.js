
var err = (x) => {
	throw new Error(x);}

var isNumeric = (n) => {
    return Number(parseFloat(n))==n && isFinite(n);}

var numericArray = (arr) => {
	arr.forEach( (x) => {
		isNumeric(x) || err("Array element required to be numeric.")
	})
	return arr;
}

var numericNum = (num) => {
	isNumeric(num) || err("Variable required to be numeric.");
	return num
}

var zipWith = (arrOne, arrTwo, func) => {
	(arrOne.length == arrTwo.length) || err("Arrays must be of same length.");
	return numericArray(arrOne.map(function(_, i){
		return func(arrOne[i], arrTwo[i]);
	}));
}

var sum = (arr) => {
	return numericNum(arr.reduce(function(total, indiv){
		return total + indiv;
	}, 0));
}

var ident = (x) => x

var flatMap = (arr, fnc) => {
	return arr.reduce( (total, cur) => {
		return total.concat(cur);
	}, [])
}

var normal = (stdev) => {
	return () => {
		var total = -6;
		for(var x = 0; x < 12; x++){
			total = total + Math.random();
		}
		return total * stdev;
	}
}

module.exports = {numericNum, numericArray,
	zipWith, sum, err, normal}