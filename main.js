'use strict';

function Canvas () {
	this.canvas = undefined;

	// Number of columns
	this.maxCol = 7;
	this.maxRow = 19;

	// Canvas start padding
	this.xAxisBegin = 30;
	this.yAxisBegin = 6;

	// Step between squares
	this.xAxisStep = 60;
	this.yAxisStep = 5; 

	// Squares dimentions
	this.rectWidth = 12;
	this.rectHeight = 12;

	// Array to save the selected squares
	this.selectedSquares = new Array(this.maxCol+1).fill(null);
}

Canvas.prototype.init = function () {
	this.canvas = new fabric.Canvas('canvas');

	// Default settings
	this.canvas.selection = false;
	this.canvas.hoverCursor = 'pointer';
	this.canvas.renderOnAddRemove = false;

	this.paint();
};

Canvas.prototype.paint = function () {
	this.canvas.clear();

	this.drawLines();

	this.drawSqares();

	this.canvas.renderAll();
}

Canvas.prototype.drawLines = function () {
	for (var i = 0; i < this.selectedSquares.length; i++) {
		// Check if there are 2 consecutive selections to make a line
		if (this.selectedSquares[i] !== null && this.selectedSquares[i+1] !== null){
			var line = new fabric.Line([
				(this.selectedSquares[i].left + this.rectWidth / 2), // First point X
				(this.selectedSquares[i].top + this.rectHeight / 2), // First point Y
				(this.selectedSquares[i+1].left + this.rectWidth / 2), // Second point X
				(this.selectedSquares[i+1].top + this.rectHeight / 2) // Second point Y
			], this.extendObj({stroke: 'green'}));
			this.canvas.add(line);
		}
	}
}

Canvas.prototype.drawSqares = function () {
	for (var x = 0; x < this.maxCol; x++) {
		for (var y = 0; y < this.maxRow; y++) {
			// Add square in coordinates [X,Y]
			this.addSquare(x,y);
		}
	}
}

Canvas.prototype.addSquare = function (x,y) {
	var square = {
		pos: {x:x, y:y}, 
		left: this.xAxisBegin + (x * this.xAxisStep) + (x * this.rectWidth), // Calc
		top:  this.yAxisBegin + (y * this.yAxisStep) + (y * this.rectHeight),
		width: this.rectWidth,
		height: this.rectHeight,
		fill: 'red',
		toogle: false
	}

	// check if square is selected and change fill & toogle
	if (this.selectedSquares[x] !== null){
		if (this.selectedSquares[x].pos.y === y){
			square.fill = 'blue';
			square.toogle = true;
		}
	}

	// Create new rect and add it to canvas
	var rect = new fabric.Rect(this.extendObj(square));
	this.squareClickListener(rect);
	this.canvas.add(rect);
}

Canvas.prototype.squareClickListener = function (rect) {
	var self = this;
	rect.on('mouseup', function(e) {
		var target = e.target;

		// Toogle selection
		target.toogle = !target.toogle;

		// Add/Remove to array selectedSqares based on toogle
		self.selectedSquares[target.pos.x] = ((target.toogle) ? target : null);

		self.paint();
	});
}

// Util functions
Canvas.prototype.extendObj = function (obj) {
	// Return a new combined object
	var _defaultOpts = {
		selectable: false,
		hasControls: false,
		objectCaching: false
	}
	return $.extend({}, obj, _defaultOpts);
}



$(document).ready(function(){
	// Create new canvas object and init
	var canvas = new Canvas();
	canvas.init();
});




