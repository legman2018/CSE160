// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() { 
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor; 
  }`


// global vars
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

function setupWebGl() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}


function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }


  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function updateAnimationAngles() {
  if (g_tailAnimation) {
    tail_angle = 45 * Math.sin(g_seconds);
  }

  if (g_tailTipAnimation) {
    tailTipAngle = 45 * Math.sin(g_seconds);
  }

  if (g_flipperAnimation) {
    flipperAngle = 45 * Math.sin(g_seconds);
  }

  if (shiftClicked) {
    headAngle = 45 * Math.sin(g_seconds);
    setTimeout(function() {
      shiftClicked = false;
      headAngle = 0;
    }, 2000);
  }

}

function renderScene() {

  var globalRotMat = new Matrix4();
globalRotMat.rotate(g_dragAngleX, 1, 0, 0); // drag X (up/down)
globalRotMat.rotate(g_sliderAngleY + g_dragAngleY, 0, 1, 0); // sum of slider + drag Y
gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  
  var body = new Cube();
  body.color = [.5, .5, .5, 1];
  body.matrix.translate(-0.3, -.5, -.5);
  body.matrix.scale(0.55, 0.7, 0.8);
  body.render();

  var head = new Cube();
  head.color = [.5, .5, .5, 1];
  head.matrix.translate(-0.23, 0.2, -0.7);
  head.matrix.scale(0.4, 0.3, 0.5);
  head.matrix.rotate(headAngle, 0, 1, 0);
  var headCoordsMat = new Matrix4(head.matrix);
  head.render();

  var eye1 = new Cube();
  eye1.color = [0, 0, 0, 1];
  eye1.matrix = headCoordsMat;
  eye1.matrix.translate(-0.1, 0.25, -0.06);
  eye1.matrix.scale(0.3, 0.3, 0.3);
  eye1.render();  

  var eye2 = new Cube();
  eye2.color = [0, 0, 0, 1];
  eye2.matrix = headCoordsMat;
  eye2.matrix.translate(3.2, 0.05, -0.06);
  eye2.matrix.scale(1, 1, 1);
  eye2.render(); 


  var horn = new Cylinder();
  horn.color = [1,1,1,1];
  horn.matrix = headCoordsMat;
  horn.matrix.translate(-1.2, 2, 0.5)
  horn.matrix.scale(0.7,7,1);
  horn.matrix.rotate(-20, 1, 0, 0);
  horn.render();
  
  //var cylin = new Cylinder();
  //cylin.color = [0.5, 0.8, 1.0, 1.0]; // light blue
  //cylin.matrix.translate(-0.3, 0.0, 0.0);
  //cylin.matrix.scale(0.2, 0.4, 0.2); // small
  //cylin.render();
  
  //var horn_tip = new Cube();
  //horn_tip.color = [1, 1, 1, 1];
  //horn_tip.matrix.translate(-0.08, 0.65, -0.54);
  //horn_tip.matrix.scale(0.1, 0.5, 0.1);
  //horn_tip.matrix.rotate(-100, 1, 0, 0);
  //horn_tip.render();
  
  var flipper1 = new Cube();
  flipper1.color = [.5, .5, .5, 1];
  flipper1.matrix.translate(0.2, -0.5, -0.3);
  flipper1.matrix.rotate(flipperAngle, 1, 0, 0);
  flipper1.matrix.scale(0.3, 0.05, 0.5);
  flipper1.render();

  var flipper2 = new Cube();
  flipper2.color = [.5, .5, .5, 1];
  flipper2.matrix.translate(-0.5, -0.5, -0.3);
  flipper2.matrix.rotate(-flipperAngle, 1, 0, 0);
  flipper2.matrix.scale(0.3, 0.05, 0.5);
  flipper2.render();


  // this will be the joints
  var tail_base = new Cube();
  tail_base.color = [.5, .5, .5, 1];
  tail_base.matrix.translate(-0.3, -0.5, 0.2);
  tail_base.matrix.scale(0.6, 0.2, 0.5);
  tail_base.render();



  var tail = new Cube();
  tail.color = [.5, .5, .5, 1];
  tail.matrix.translate(-0.1, -0.45, 0.5);
  tail.matrix.scale(0.2, 0.6, 0.3);
  tail.matrix.rotate(tail_angle, 1, 0, 0);

  //if (g_tailAnimation) {
  //  tail.matrix.rotate(45*Math.sin(g_seconds), 1, 0, 0);
  //} else{
  //  tail.matrix.rotate(tail_angle, 1, 0, 0);
  //}
  var tailCoordsMat = new Matrix4(tail.matrix);
  tail.render();

  var tail_tip = new Cube();
  tail_tip.color = [.5, .5, .5, 1];
  tail_tip.matrix = tailCoordsMat;
  tail_tip.matrix.translate(-1.1, 0.8, 0.4);
  tail_tip.matrix.scale(3, 0.8, 0.8);
  tail_tip.matrix.rotate(tailTipAngle, 0, 1, 0);
  tail_tip.render();

  // test cylinder 
  
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
var g_frameCount = 0;
var g_lastFpsUpdateTime = performance.now();
function tick() {
  g_seconds = performance.now()/1000.0 - g_startTime;
  console.log(g_seconds);
  
  updateAnimationAngles();
  renderScene();             
  
  g_frameCount++;
  let now = performance.now();
  if (now - g_lastFpsUpdateTime > 1000) { // update every second
    let fps = g_frameCount / ((now - g_lastFpsUpdateTime) / 1000);
    document.getElementById("fps").innerText = "FPS: " + fps.toFixed(1);
    g_frameCount = 0;
    g_lastFpsUpdateTime = now;
  }


  requestAnimationFrame(tick); 
}

let shiftClicked = false;
let pokeAnimation = false;
var g_shapesList = [];
// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];
function click(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segments = g_selectedSegments;
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  if (point.type === 'triangle') {
    const [r, g, b, a] = point.color;
    const verts = point.getVertices();
  
    
    
  }

  // FOR POKE ANIMATION
  if (ev.shiftKey) {
    shiftClicked = true;
    updateAnimationAngles();
  }
  
  // Store the coordinates to g_points array
  //g_points.push([x,y]);
  //g_colors.push(g_selectedColor);
  //g_colors.push(g_selectedColor.slice())
  //g_sizes.push(g_selectedSize)

  // Store the coordinates to g_points array
  /*if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }
  */ 
  // renderAllShapes();
  
}



// globals for ui
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10; 
let g_globalAngle = 45;
let tail_angle = 0;
let tailTipAngle = 0;
let flipperAngle = 0;
let headAngle = 0;
let g_tailAnimation = false;
let g_tailTipAnimation = false;
let g_flipperAnimation = false;
let g_sliderAngleY = 0;  // From the slider
let g_dragAngleX = 0;    // Mouse drag up/down
let g_dragAngleY = 0;    // Mouse drag left/right

let g_lastMouseX = 0;
let g_lastMouseY = 0;
let g_isDragging = false;
function addActionsForHtmlUI() {
    //button color
    //document.getElementById('green').onclick = function() {g_selectedColor = [0.0, 1.0, 0.0, 1.0];};
    //document.getElementById('red').onclick = function() {g_selectedColor = [1.0, 0.0, 0.0, 1.0];};

    // shape buttons
    document.getElementById('pointButton').onclick = function() {g_selectedType = POINT;};
    document.getElementById('triangleButton').onclick = function() {g_selectedType = TRIANGLE;};
    document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE;};

    // slider color
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100;});
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100;});
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100;});

    // size slider
    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value;});
    document.getElementById('segSlide').addEventListener('mouseup', function() { g_selectedSegments = this.value;});

    // clear button
    document.getElementById('clearButton').onclick = function() {g_shapesList= [];};

    // angle slider
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_sliderAngleY = this.value % 360; renderScene(); });
    
    // tail joint slider
    document.getElementById('tailSlide').addEventListener('mousemove', function() { tail_angle = this.value; renderScene(); });
    
    document.getElementById('tailTipSlide').addEventListener('mousemove', function() { tailTipAngle = this.value; renderScene(); });


    document.getElementById('tailAnimationON').onclick = function() {g_tailAnimation = true;};
    document.getElementById('tailAnimationOFF').onclick = function() {g_tailAnimation = false;};

    document.getElementById('tailTipAnimationON').onclick = function() {g_tailTipAnimation = true;};
    document.getElementById('tailTipAnimationOFF').onclick = function() {g_tailTipAnimation = false;};

    document.getElementById('flipperSlide').addEventListener('mousemove', function() { flipperAngle= this.value; renderScene(); });
    document.getElementById('flipperAnimationON').onclick = function() {g_flipperAnimation = true;};
    document.getElementById('flipperAnimationOFF').onclick = function() {g_flipperAnimation = false;};


  
}   


function main() {
  
  setupWebGl();
  
  connectVariablesToGLSL();

  addActionsForHtmlUI(); 

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if (ev.buttons == 1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // transparency feature
  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // renderAllShapes();

  canvas.onmousedown = function(ev) {
    g_isDragging = true;
    g_lastMouseX = ev.clientX;
    g_lastMouseY = ev.clientY;
};

canvas.onmouseup = function(ev) {
    g_isDragging = false;
};

canvas.onmousemove = function(ev) {
    if (g_isDragging) {
        let deltaX = ev.clientX - g_lastMouseX;
        let deltaY = ev.clientY - g_lastMouseY;
        g_dragAngleY = (g_dragAngleY + deltaX * 0.5) % 360;
        g_dragAngleX = (g_dragAngleX + deltaY * 0.5) % 360;
        g_lastMouseX = ev.clientX;
        g_lastMouseY = ev.clientY;
    }
};
  
  requestAnimationFrame(tick);
  
}




