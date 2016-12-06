var fs = require('fs');

const loc = './small_mnist.json'

module.exports = {

	allElements: function(){
		return JSON.parse(fs.readFileSync(loc).toString());},

	zeroAndOne: function(){
		return JSON.parse(fs.readFileSync(loc).toString())
					.filter(function(n){ return n[1][1] == 1 || n[1][0] == 1 } );},

	fiveAndNine: function(){
		return JSON.parse(fs.readFileSync(loc).toString())
					.filter(function(n){ return n[1][5] == 1 || n[1][9] == 1} );},

	fourAndSixAndEight: function(){
		return JSON.parse(fs.readFileSync(loc).toString())
					.filter(function(n){ return n[1][4] == 1 || n[1][6] == 1 || n[1][8] == 1} );},

	zeroAndOneAndFive: function(){
		return JSON.parse(fs.readFileSync(loc).toString())
					.filter(function(n){ return n[1][0] == 1 || n[1][1] == 1 || n[1][5] == 1} );}

}