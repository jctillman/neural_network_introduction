const util = require('./util.js');
const err = util.err;
const Matrix = require('./line_alge_matr.js');

//Quick matrix collection class
//It is a wrapper ofr objects with id -> mtrs
class MtrCol{

	constructor(obj){

		//Should only have other matrices as members of it.
		Object.keys(obj).forEach((key) => {
			Matrix.checkIsMtr(obj[key]);
		});

		this.obj = obj;
	}

	extr(){
		return this.obj;
	}

	operator(otherCol, operatorName){
		MtrCol.checkIsCol(otherCol);
		MtrCol.checkHasSameElements(this, otherCol);
		return new MtrCol( util.objMap( this.obj, (_, key) => {
			return this.obj[key][operatorName](otherCol.obj[key]);
		}));
	}

	add(otherCol){ return this.operator(otherCol, "add"); }

	piecewise(fnc){
		return new MtrCol( util.objMap( this.obj, (mtr) => {
			return mtr.piecewise(fnc);
		}));
	}

	pow(num){ return this.piecewise( x => Math.pow(x,num) ); }

	zero(){ return this.piecewise( () => 0); }

	static checkIsCol(otherCol){
		(otherCol instanceof MtrCol) || 
			err("Collection required.");}

	static checkHasSameElements(oneCol, twoCol){
		const oneKeys = Object.keys(oneCol.obj);
		const twoKeys = Object.keys(twoCol.obj);
		(oneKeys.length == twoKeys.length) ||
			err("Collections must have same number of elements.");
		oneKeys.forEach( (oneKey) => {
			(twoKeys.indexOf(oneKey) > -1) ||
				err("Collections must have isomorphic ids.");
		});
	}

}

module.exports = MtrCol;