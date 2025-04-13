// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size; 
  void main() { 
    gl_Position = a_Position; 
    // gl_PointSize = 30.0; 
    gl_PointSize = u_Size;
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

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

function renderAllShapes() {
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
      
    }
}



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
  
    console.log(
      `gl.uniform4f(u_FragColor, ${r.toFixed(2)}, ${g.toFixed(2)}, ${b.toFixed(2)}, ${a.toFixed(2)});\n` +
      `drawTriangle([${verts.map(v => v.toFixed(2)).join(", ")}]);`
    );
    
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
  renderAllShapes();
  
}

function drawReference() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.36, 0.48, -0.56, 0.08, -0.16, 0.08]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.29, 0.48, 0.09, 0.08, 0.49, 0.08]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.06, 0.10, 0.02, 0.03, 0.09, 0.03]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.49, -0.11, -0.53, -0.18, -0.45, -0.18]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.44, -0.14, -0.47, -0.21, -0.41, -0.21]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.40, -0.19, -0.44, -0.26, -0.36, -0.26]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.34, -0.25, -0.38, -0.32, -0.31, -0.32]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.28, -0.30, -0.32, -0.37, -0.25, -0.37]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.21, -0.34, -0.24, -0.41, -0.17, -0.41]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.10, -0.38, -0.14, -0.45, -0.07, -0.45]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.02, -0.43, -0.06, -0.50, 0.02, -0.50]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.02, -0.43, -0.06, -0.50, 0.02, -0.50]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.08, -0.44, 0.04, -0.51, 0.12, -0.51]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.20, -0.44, 0.17, -0.51, 0.24, -0.51]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.26, -0.42, 0.23, -0.49, 0.30, -0.49]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.27, -0.42, 0.24, -0.49, 0.31, -0.49]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.34, -0.39, 0.31, -0.45, 0.38, -0.45]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.39, -0.34, 0.35, -0.42, 0.43, -0.42]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.43, -0.31, 0.40, -0.39, 0.46, -0.39]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.48, -0.27, 0.44, -0.34, 0.52, -0.34]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.53, -0.22, 0.49, -0.29, 0.57, -0.29]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.58, -0.15, 0.54, -0.22, 0.61, -0.22]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.61, -0.08, 0.57, -0.15, 0.65, -0.15]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.64, 0.63, -0.67, 0.56, -0.60, 0.56]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.58, 0.64, -0.61, 0.56, -0.54, 0.56]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.51, 0.63, -0.55, 0.56, -0.47, 0.56]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.43, 0.63, -0.46, 0.56, -0.40, 0.56]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.37, 0.63, -0.41, 0.56, -0.33, 0.56]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.37, 0.63, -0.41, 0.56, -0.33, 0.56]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.29, 0.61, -0.32, 0.54, -0.26, 0.54]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([-0.29, 0.61, -0.32, 0.54, -0.26, 0.54]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.26, 0.60, 0.23, 0.53, 0.30, 0.53]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.33, 0.60, 0.30, 0.53, 0.36, 0.53]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.41, 0.60, 0.38, 0.53, 0.44, 0.53]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.52, 0.59, 0.48, 0.52, 0.56, 0.52]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);
  drawTriangle([0.60, 0.59, 0.56, 0.52, 0.64, 0.52]);
  gl.uniform4f(u_FragColor, 1.00, 1.00, 1.00, 1.00);

}

// globals for ui
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10; 
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
    document.getElementById('clearButton').onclick = function() {g_shapesList= []; renderAllShapes(); };

    // transparency feature
    document.getElementById('opacitySlide').addEventListener('mouseup', function() {g_selectedColor[3] = this.value / 100;});

    // draw reference
    document.getElementById('specialDraw').onclick = function() {drawReference();};

    
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
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}




