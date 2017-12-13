'use strict';

class Canvas {
	constructor() {
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

	init() {
		this.canvas = new fabric.Canvas('canvas');

		// Default settings
		this.canvas.selection = false;
		this.canvas.hoverCursor = 'pointer';
		this.canvas.renderOnAddRemove = false;

		this.paint();
	};

	paint() {
		this.canvas.clear();

		this.drawLines();

		this.drawSqares();

		this.canvas.renderAll();
	}

	drawLines() {
		for (let i = 0; i < this.selectedSquares.length; i++) {
			// Check if there are 2 consecutive selections to make a line
			if (this.selectedSquares[i] !== null && this.selectedSquares[i+1] !== null){
				const linePoints = [
					(this.selectedSquares[i].left + this.rectWidth / 2), // First point X
					(this.selectedSquares[i].top + this.rectHeight / 2), // First point Y
					(this.selectedSquares[i+1].left + this.rectWidth / 2), // Second point X
					(this.selectedSquares[i+1].top + this.rectHeight / 2) // Second point Y
				];
				// Add line
				const line = new fabric.Line(linePoints, this.extendObj({stroke: 'green'}));
				this.canvas.add(line);
			}
		}
	}

	drawSqares() {
		for (let x = 0; x < this.maxCol; x++) {
			for (let y = 0; y < this.maxRow; y++) {
				// Add square in coordinates [X,Y]
				this.addSquare(x,y);
			}
		}
	}

	addSquare(x,y) {
		const square = {
			pos: {x, y}, 
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
		const rect = new fabric.Rect(this.extendObj(square));
		this.squareClickListener(rect);
		this.canvas.add(rect);
	}

	squareClickListener(rect) {
		rect.on('mouseup', e => {
			const target = e.target;

			// Toogle selection
			target.toogle = !target.toogle;

			// Add/Remove to array selectedSqares based on toogle
			this.selectedSquares[target.pos.x] = ((target.toogle) ? target : null);

			this.paint();
		});
	}

	// Util functions
	extendObj(obj) {
		// Return a new combined object
		const _defaultOpts = {
			selectable: false,
			hasControls: false,
			objectCaching: false
		}
		return Object.assign({}, obj, _defaultOpts);
	}

}


// Create new canvas object and init
const canvas = new Canvas();
canvas.init();




