var base = require("../base.js");

describe("base tests", function() {
	// Positions of Board
	// 0   1   2   3   4   5   6
	// 7   8   9   10  11  12  13
	// 14  15  16  17  18  19  20
	// 21  22  23  24  25  26  27
	// 28  29  30  31  32  33  34
	// 35  36  37  38  39  40  41

	var NOT_DONE = 0;
	var WON = 1;
	var LOST = 2;

	it("should retrieve 'XXX' from pos 15, 22, 29, 36", function() {
		var boardString = 	"-------" + 
							"-------" +
							"-X-----" +
							"-X-----" +
							"OX-----" + 
							"OXO----";
		var values = base.getStringsAtPositions(boardString, 15, 22, 29, 36);
		
		expect(values).toBe('XXXX');
	});

	it("should return that human (with X token) won", function() {
		var sectionString = "XXXX";

		var result = base.checkSectionVictory(sectionString);
		
		expect(result).toBe(WON);
	});

	it("should return that machine (with O token) won", function() {
		var sectionString = "OOOO";

		var result = base.checkSectionVictory(sectionString);
		
		expect(result).toBe(LOST);
	});

	it("should return that game is not done", function() {
		var sectionString = "O-OX";

		var result = base.checkSectionVictory(sectionString);
		
		expect(result).toBe(NOT_DONE);
	});

	it("should return that human won, 4 in line in 1st row", function() {
		var boardString = 	"-------" + 
							"-------" +
							"-------" +
							"-------" +
							"O------" + 
							"O-OXXXX";
		var result=base.checkForVictory(boardString);

		expect(result).toBe(WON);
	});

	it("should return that human won, 4 in line in 2nd row", function() {
		var boardString = 	"-------" + 
							"-------" +
							"-------" +
							"O------" +
							"OOXXXX-" + 
							"OXOOXOX";
		var result=base.checkForVictory(boardString);

		expect(result).toBe(WON);
	});

	it("should return that human lost, 4 in line in 1st column", function() {
		var boardString = 	"-------" + 
							"-------" +
							"O------" +
							"O------" +
							"OOXX-XX" + 
							"OXOOXOX";
		var result=base.checkForVictory(boardString);

		expect(result).toBe(LOST);
	});

	it("should return that human won, 4 in line in diagonal 36, 30, 24, 18", function() {
		var boardString = 	"-------" + 
							"-------" +
							"----X--" +
							"---XO--" +
							"-OXOOX-" + 
							"OXOOXOX";
		var result=base.checkForVictory(boardString);

		expect(result).toBe(WON);
	});

	it("should return that machine won, 4 in line in diagonal 36, 30, 24, 18", function() {
		var boardString = 	"-------" + 
							"-------" +
							"-O-X---" +
							"-OOX---" +
							"-OXOXXX" + 
							"OXXOOOX";
		var result=base.checkForVictory(boardString);

		expect(result).toBe(LOST);
	});
});
