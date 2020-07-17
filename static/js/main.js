// THE MAIN FILE WHICH HANDLES DRAWING, SETTING UP A P5JS CANVAS ETC.

let shuffleButton;    // the button used for shuffling
let face;             // the face image
let mask1;            // the mask canvas
let paint1;           // the paint image
let maskedPaint1;     // variable to hold the masked paint
let mask2;            // the mask canvas
let paint2;           // the paint image
let maskedPaint2;     // variable to hold the masked paint
let maskBrush;        // the 'brush' we'll draw on the mask with (a black circle)
let sketch;           // the sketch, which is an html canvas elem
let brushType = 0;    // current type of brush 
 
function preload () {
    // load in all the images
    face = loadImage("static/img/face.JPG");
    paint1 = loadImage("static/img/paint1.png");
    paint2 = loadImage("static/img/paint2.png");
    maskBrush = loadImage("static/img/brush-sq.png");
}

function setup() {
    sketch = createCanvas(600, 600);
    sketch.id('myP5canvas1');

    // create the shuffle button
    shuffleButton = createButton('Shuffle');
    shuffleButton.position(0, 0);
    shuffleButton.mousePressed(shuffleVar);
    shuffleButton.class('button');

    // why are we declaring a new brushSize here? 
    // seems like we can just declare it on line 17 as global declaration and assignment at the same time
    // buttons for brush size
    let brushSize = 38;
    brushSize = select('#brushSml');
    brushSize.mousePressed(switchSmlBrush);
    brushSize = select('#brushMed');
    brushSize.mousePressed(switchMedBrush);

    // INITIAL RESET OF SKETCH
    resetSketch();
}

///////////////////////
// the main loop
function draw() {
  // draw the masked paint image over the top of the face...
  image(maskedPaint1, 0, 0, width, height); 
  image(maskedPaint2, 0, 0, width, height);

  // if the mouse is pressed, then the painting can start
  if (mouseIsPressed === true) {
    // a switch to determine how to draw the brush
    // the default is brush 0
    switch (brushType) {
        case 0:
            drawBrush0();
            break;
        case 1:
            drawBrush1();
            break;
        default:
            drawBrush0();
    }      
  }
      
}

///////////////////////
function drawBrush0() {
    maskedPaint1 = paint1.get();
    maskedPaint1.mask(mask1.get());
    mask1.stroke('rgba(255,255,255, 0.9)');
    mask1.strokeWeight(brushSize);
    mask1.image(maskBrush, mouseX, mouseY, brushSize, brushSize - 4);
    mask1.line(mouseX, mouseY, pmouseX, pmouseY);
}

///////////////////////
function drawBrush1() {
    maskedPaint2 = paint2.get();
    maskedPaint2.mask(mask2.get());
    mask2.stroke('rgba(255,255,255, 0.6)');
    mask2.strokeWeight(brushSize);
    mask2.image(maskBrush, mouseX, mouseY, brushSize, brushSize - 4);
    mask2.line(mouseX, mouseY, pmouseX, pmouseY);
}
  
///////////////////////
// function for creating graphics elements and using masks on the elems
function resetSketch() {
    // create a graphics element for each brush
    // since they are different graphic elems, the code must be somewhat redundant, they need separate function calls
    mask1 = createGraphics(width, height);
    mask1.imageMode(CENTER);
    // save a copy of the paint image
    maskedPaint1 = paint1.get();
    // apply a mask to the copied img
    maskedPaint1.mask(mask1.get());

    mask2 = createGraphics(width, height);
    mask2.imageMode(CENTER);
    maskedPaint2 = paint2.get();
    maskedPaint2.mask(mask2.get());

    // draw the face on the "original" sketch canvas, which places it below the 2 mask canvases
    image(face, 0, 0, width, height);
}