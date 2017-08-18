//init tissue paper position and size variables
var initTopEdge, initBottomEdge, leftEdge, rightEdge;
var paperHeight, paperWidth, curveWidth, curveHeight, spacing, paperStrokeWeight;
var initSpeed, slowDownZoneHeight;
var outsidePaperHeightScale = 0.2;

//init tissue paper box position and size variables
var boxWidth, boxHeight, boxDepth, perspective, boxX, boxY, slotWscale, slotHscale, boxStrokeWeight;

//init an array to storage each paper's position and speed
var paperArray = [];

//init an array to storage each paper's stain drew by users
var traceArray = [];
var stainRadius;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('paper-container');
  initBox(); //init tissue paper box
}

//this is the function to init the sizes positions and shapes of the box and the papers
function initBox() {

  clear(); //p5.js function, clear the canvas

  //init strokeWidth to keep graphics consistent
  paperStrokeWeight = 0.008 * windowWidth; //windowWidth and windowHeight are p5.js variables that takes the with and height from the window object
  boxStrokeWeight = 0.008 * windowWidth;

  $("#title-container").css({
    "border-width": 0.008 * windowWidth
  });

  //init box size and position based on window size
  boxWidth = width * 0.48; //width and height are p5.js variables that takes the width and height from the canvas
  boxHeight = height * 0.32;
  boxDepth = height * 0.2;
  perspective = 0.5; //controls the perspective of the box

  boxX = width / 2 - (boxWidth + boxDepth) / 2; //box positions
  boxY = height * 0.76;

  slotWscale = 0.76; // = slot's width / boxWidth
  slotHscale = 0.1; // = slot's height / boxHeight

  //box sizes initialized, read to display
  displayBox();

  //init paper sizes and positions
  initBottomEdge = boxDepth * perspective * (0.5 - slotHscale / 2) + boxY;
  initTopEdge = initBottomEdge * (1 - outsidePaperHeightScale);

  paperHeight = height * 0.5;
  paperWidth = width * 0.3;

  //limit the ratio of the shape
  if(paperHeight/paperWidth> 1.3){
    paperHeight = 1.3 *paperWidth;
  }else if(paperHeight/paperWidth< 0.7){
    paperHeight = 0.7 *paperWidth;
  }
  //init the curveness of the edge of papers
  curveHeight = height * 0.00002;
  curveWidth = width * 0.01;

  leftEdge = (width - paperWidth) / 2;
  rightEdge = (width + paperWidth) / 2;

  //init the spacing between two papers
  spacing = paperHeight * 0.001;
  initSpeed = height * 0.01; //the acceleration of paper moving

  stainRadius = width * 0.03; //the radius of stains on the paper
  traceArray=[[],[],[],[]];
  paperArray=[];
  //add the first paper to the paper array
  paperArray[0] = {
    t: initTopEdge,
    b: initBottomEdge,
    s: initSpeed
  };

  //initialized the first paper, ready to display
  displayPaper(initTopEdge, initBottomEdge);
}

//this is the function to display the box
function displayBox() {

  push();
  translate(boxX, boxY); //translate box position
  fill("#B690C3");
  stroke(0);
  strokeWeight(boxStrokeWeight);
  strokeJoin(ROUND);

  //draw box front surface
  rect(0, boxDepth * perspective, boxWidth, boxHeight);

  //draw box side surface
  beginShape();
  vertex(boxWidth, boxDepth * perspective)
  vertex(boxDepth + boxWidth, 0)
  vertex(boxDepth + boxWidth, boxHeight)
  vertex(boxWidth, boxHeight + boxDepth * perspective)
  endShape(CLOSE);

  //draw box top surface
  fill("#8ECCC1");
  beginShape();
  vertex(boxDepth, 0);
  vertex(boxDepth + boxWidth, 0);
  vertex(boxWidth, boxDepth * perspective);
  vertex(0, boxDepth * perspective);
  endShape(CLOSE);

  //draw top slot
  fill(100);
  //The top slot is calculated from the sizes of the box, so that the slot is centered on the top of the box
  var slotX = (boxWidth + boxDepth - boxWidth * slotWscale) / 2; //the X pos of the slot
  var slotY = (boxDepth * perspective  -boxDepth * slotHscale) / 2; //the Y pos of the slot
  var slotW = boxWidth * slotWscale; //the width of the slot
  var slotH = boxDepth * slotHscale; //the height of the slot
  var slotR = boxDepth * slotHscale / 2; //the radius of the rect

  rect(slotX, slotY, slotW, slotH, slotR);
  pop();
}


//this function is called everytime the canvas is scrolled
function pullPaper(data) {
  //data is the value of scrolling up
  clear();
  displayBox();

  //check if paer is out of window displayPlay
  if (paperArray[0].b <= 0) {
    paperArray = paperArray.slice(1); // first element removed
    traceArray = traceArray.slice(1);
    traceArray[traceArray.length] = [];
  }

  for (var i = 0; i < paperArray.length; i++) {
    paperArray[i].s += 0.006 * data; //change speed according to scroll motion
    paperArray[i].t -= paperArray[i].s; //update paper position according to speed

    //check if paper is still in the box
    if ((paperArray[i].t + paperHeight) > initBottomEdge) {
      paperArray[i].b = initBottomEdge;
    } else {
      paperArray[i].b = paperArray[i].t + paperHeight;
    }
  }

  //check if need to pull out new paper
  if (paperArray[paperArray.length - 1].b < initBottomEdge - spacing) {
    paperArray.push({
      t: initBottomEdge,
      b: initBottomEdge,
      s: initSpeed
    });
  }

  //check if there's any 'stain' that could display, 'stain' is drew by usres
  for (var i = 0; i < paperArray.length; i++) {
    displayPaper(paperArray[i].t, paperArray[i].b);
    if (traceArray[i] != null && [i].length > 0) {
      displayStain(i);
    }
  }
}

function displayPaper(t, b) {
  stroke(0);
  strokeJoin(ROUND);
  strokeWeight(paperStrokeWeight);
  fill(255);

  beginShape();
  for (var i = t; i < b; i++) {
    vertex(leftEdge + curveWidth * Math.sin(curveHeight * i), i);
  }

  for (var i = b; i >= t; i--) {
    vertex(rightEdge + curveWidth * Math.sin(curveHeight * i), i);
  }
  endShape(CLOSE);

}

//this function is a p5.js function that listens to the mouse dragging events
function mouseDragged() {

//check if the mouse is in the area of papers
  if ((leftEdge + curveWidth + stainRadius) < mouseX && mouseX < (rightEdge - curveWidth - stainRadius)) {
    for (var i = 0; i < paperArray.length; i++) {
      if (paperArray[i].t + stainRadius < mouseY && mouseY < paperArray[i].b - stainRadius) {
        noStroke();
        fill(220);
        ellipse(mouseX, mouseY, stainRadius, stainRadius);
        traceArray[i].push({
          x: mouseX - leftEdge,
          y: mouseY - paperArray[i].t
        });
      }
    }
  }
  //prevent page fom being dragged
  return false;
}

//this function displays the 'stains' drew by mouse drag
function displayStain(n) {
  for (var i = 0; i < traceArray[n].length; i++) {
    noStroke();
    fill(220);
    ellipse(traceArray[n][i].x + leftEdge, traceArray[n][i].y + paperArray[n].t, stainRadius, stainRadius);
  }
}

//this function is a p5.js function that listens to the resizing events
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initBox();
}

//jQuery function that's listening to mousewheel events
$('body').bind('mousewheel', function(e) {
  if (e.originalEvent.wheelDelta < 0) {
    pullPaper(-e.originalEvent.wheelDelta);
  }

  //prevent page fom scrolling
  return false;
});
