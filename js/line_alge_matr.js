const util = require('./util.js');

const zipWith = util.zipWith;
const sum = util.sum;
const err = util.err;
const numericNum = util.numericNum;
const numericArr = util.numericArray;
const flatMap = util.flatMap;

class Matrix {

	constructor(arr){
		if (Array.isArray(arr[0])){
			arr.forEach(numericArr);
			this.mx = arr
		}else{
			numericArr(arr)
			this.mx = arr.map( n => [n] )
		}			
	}

	_check(otherMatr){
		(otherMatr instanceof Matrix) || 
			err("Matrix required.");}

	_equalDims(otherMatr){
		(otherMatr.mx.length == this.mx.length) &&
		(otherMatr.mx[0].length == this.mx[0].length) ||
			err("Matrices must be of equal size.")}

	_isVector(otherMatr){
		(otherMatr.mx[0].length == 1) ||
			err("Matrix must be a vector, i.e., have only one column.")}

	_multDims(otherMatr){
		(this.mx[0].length == otherMatr.mx.length) ||
			err("Colunms in first matrix must equal rows in second.")}

	dims(){ return [ this.mx.length, this.mx[0].length] }
	
	row(num){ return this.mx[num];}

	col(num){ return this.mx.map( (r) => r[num]);}

	trans(){
		return new Matrix(this.mx[0].map( (_, i) => {
			return this.col(i);
		}));
	}

	add(otherMatr){
		this._check(otherMatr);
		this._equalDims(otherMatr);
		return Matrix.make(this.dims(), (row,col) => {
			return this.mx[row][col] + otherMatr.mx[row][col];
		});
	}

	add_broadcast(otherMatr){
		this._check(otherMatr)
		this._isVector(otherMatr);
		return Matrix.make( this.dims(), (row, col) => {
			return this.mx[row][col] + otherMatr.mx[col][0]
		});
	}

	piecewise(fnc){
		return Matrix.make( this.dims(), (row, col) => {
			return fnc(this.mx[row][col]);
		})
	}

	reduce(fnc, start){
		return new Matrix([[
			flatMap(this.mx, util.ident).reduce( (total, element, rowIndex) => {
				return fnc(total, element);
			}, start)
		]])
	}

	sub(otherMatr){
		return this.add( otherMatr.piecewise( (x) => -x ) );
	}

	mult(otherMatr){
		this._check(otherMatr)
		this._multDims(otherMatr);
		const newRow = this.mx.length;
		const newCol = otherMatr.mx[0].length;
		return Matrix.make([newRow, newCol], (row, col) => {
			return sum(zipWith(
				this.row(row),
				otherMatr.col(col),
				(m,n) => m * n));
		});
	}

	static make(dimensions, generator){
		var [rowNum, colNum] = dimensions;
		var matrixContents = [];
		for(var x = 0; x < rowNum; x++){
			matrixContents.push([]);
			for(var y = 0; y < colNum; y++){
				matrixContents[x].push(generator(x,y));
			}
		}
		return new Matrix(matrixContents)
	}

}

module.exports = Matrix;