const util = require('./util.js');

const zipWith = util.zipWith;
const sum = util.sum;
const err = util.err;
const numericNum = util.numericNum;

class Vector {

	constructor(arr){
		this.mx = arr.map(n => [n]);}

	_check(otherVect){
		(otherVect instanceof Vector) || err("Vector required.");}
	
	dot(otherVect){
		this._check(otherVect);
		return sum(zipWith(
			otherVect.mx,
			this.mx,
			(x,y) => x[0] * y[0]));}


	add(otherVect){
		this._check(otherVect)
		return new Vector(zipWith(
			this.mx,
			otherVect.mx,
			(x,y) => x[0] + y[0]
			));}


	sub(otherVect){
		this._check(otherVect)
		return new Vector(zipWith(
			this.mx,
			otherVect.mx,
			(x,y) => x[0] - y[0]
			));}


	mult(someScalar){
		numericNum(someScalar)
		return new Vector(
			this.mx.map( (x) => x[0] * someScalar))}

}

module.exports = Vector;