const util = require('./util.js');

const zipWith = util.zipWith;
const sum = util.sum;
const err = util.err;
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

	dims(){ return [ this.mx.length, this.mx[0].length] }
	
	row(num){ return this.mx[num];}

	col(num){ return this.mx.map( (r) => r[num]);}

	copy() { return this.piecewise((x) => x)}

	trans(){
		return new Matrix(this.mx[0].map( (_, i) => {
			return this.col(i);
		}));
	}

	equalish(otherMatr, tolerance){
		Matrix.checkIsMtr(otherMatr);
		Matrix.checkEqualDims(this, otherMatr);
		const mtrFlat = util.flatMap(this.mx,util.ident);
		const otherMtrFlat = util.flatMap(otherMatr.mx,util.ident);
		return mtrFlat.every( (_, i) => {
			return Math.abs(mtrFlat[i] - otherMtrFlat[i]) < tolerance;
		})
	}

	add(otherMatr){
		Matrix.checkIsMtr(otherMatr);
		Matrix.checkEqualDims(this, otherMatr);
		return Matrix.make(this.dims(), (row,col) => {
			return this.mx[row][col] + otherMatr.mx[row][col];
		});
	}

	sub(otherMatr){
		return this.add( otherMatr.piecewise( (x) => -x ) );
	}

	mult(otherMatr){
		Matrix.checkIsMtr(otherMatr)
		Matrix.checkMultDims(this, otherMatr);
		const newRow = this.mx.length;
		const newCol = otherMatr.mx[0].length;
		return Matrix.make([newRow, newCol], (row, col) => {
			return sum(zipWith(
				this.row(row),
				otherMatr.col(col),
				(m,n) => m * n));
		});
	}

	hadamard(otherMatr){
		Matrix.checkIsMtr(otherMatr);
		Matrix.checkEqualDims(this, otherMatr);
		return Matrix.make(this.dims(), (row, col) => {
			return this.mx[row][col] * otherMatr.mx[row][col];
		});
	}

	add_broadcast_cols(otherMatr){
		Matrix.checkIsMtr(otherMatr);
		Matrix.isColumnVector(otherMatr);
		return Matrix.make( this.dims(), (row, col) => {
			return this.mx[row][col] + otherMatr.mx[col][0]
		});
	}

	add_broadcast_rows(otherMatr){
		Matrix.checkIsMtr(otherMatr);
		Matrix.isRowVector(otherMatr);
		return Matrix.make( this.dims(), (row, col) => {
			return this.mx[row][col] + otherMatr.mx[0][col]
		});
	}

	piecewise(fnc){
		Matrix.checkIsFnc(fnc);
		return Matrix.make( this.dims(), (row, col) => {
			return fnc(this.mx[row][col]);
		})
	}

	toZero(){ return this.piecewise( () => 0); }

	toOne(){ return this.piecewise( () => 1); }

	reduce(fnc, start){
		Matrix.checkIsFnc(fnc);
		return new Matrix([[
			flatMap(this.mx, util.ident).reduce( (total, element, rowIndex) => {
				return fnc(total, element);
			}, start)
		]])
	}

	static make(dimensions, generator){
		Matrix.checkIsFnc(generator)
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

	static checkIsMtr(otherMatr){
		(otherMatr instanceof Matrix) || 
			err("Matrix required.");}

	static checkEqualDims(thisMtr, otherMatr){
		(otherMatr.mx.length == thisMtr.mx.length) &&
		(otherMatr.mx[0].length == thisMtr.mx[0].length) ||
			err("Matrices must be of equal size.");
	}
			
	static isColumnVector(otherMatr){
		(otherMatr.mx[0].length == 1) ||
			err("Matrix must be a column vector, i.e., have only one column.");}

	static isRowVector(otherMatr){
		(otherMatr.mx.length == 1) ||
			err("Matrix must be a row vector, i.e., have only one row.");}

	static checkMultDims(thisMtr, otherMatr){
		(thisMtr.mx[0].length == otherMatr.mx.length) ||
			err("Colunms in first matrix must equal rows in second.");}

	static checkIsFnc(fnc){
		(typeof fnc == 'function') ||
			err("Variable must be function.");}

}

module.exports = Matrix;