// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() { 
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2){
      gl_FragColor = u_FragColor;                  
    } else if (u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0);         
    } else if(u_whichTexture == 0){
        gl_FragColor = texture2D(u_Sampler0, v_UV);  
    } else if (u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {
        gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else if (u_whichTexture == 3) {
        gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else if (u_whichTexture == 4) {
        gl_FragColor = texture2D(u_Sampler4, v_UV);
    } else {
       gl_FragColor = vec4(1,.2,.2,1);             
    }
  }`


// global vars
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;


let u_whichTexture;
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

  // a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // model matrix 
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // global matrix 
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

  // proj matrix
  u_ProjectionMatrix= gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }


  // view matrix 
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }
  

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // u sampler 1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  // u sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  // u sampler3
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }

  // u sampler4
  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return false;
  }

  // texture num
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
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

var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up = [0,1,0];
var g_camera; 
function renderScene() {
  // Pass the projection matrix
  var projMat = g_camera.projMat;
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat = g_camera.viewMat;
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // pass global rotation mat
  var globalRotMat = new Matrix4();
  globalRotMat.rotate(g_dragAngleX, 1, 0, 0); // drag X (up/down)
  globalRotMat.rotate(g_sliderAngleY + g_dragAngleY, 0, 1, 0); // sum of slider + drag Y
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);


  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  
  

  // floor 
  var floor = new Cube();
  floor.textureNum = 0;
  floor.matrix.translate(0, -0.75, 0);
  floor.matrix.scale(50, 0 , 50);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  // sky
  var sky = new Cube();
  sky.textureNum = 1;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();
  
  drawMap();


  var body = new Cube();
  body.textureNum = -2;
  body.color = [.5, .5, .5, 1];
  body.matrix.translate(-0.3, -.5, -.5);
  body.matrix.scale(0.55, 0.7, 0.8);
  body.render();

  var head = new Cube();
  head.textureNum = -2;
  head.color = [.5, .5, .5, 1];
  head.matrix.translate(-0.23, 0.2, -0.7);
  head.matrix.scale(0.4, 0.3, 0.5);
  head.matrix.rotate(headAngle, 0, 1, 0);
  var headCoordsMat = new Matrix4(head.matrix);
  head.render();

  var eye1 = new Cube();
  eye1.textureNum = -2;
  eye1.color = [0, 0, 0, 1];
  eye1.matrix = headCoordsMat;
  eye1.matrix.translate(-0.1, 0.25, -0.06);
  eye1.matrix.scale(0.3, 0.3, 0.3);
  eye1.render();  

  var eye2 = new Cube();
  eye2.textureNum = -2;
  eye2.color = [0, 0, 0, 1];
  eye2.matrix = headCoordsMat;
  eye2.matrix.translate(3.2, 0.05, -0.06);
  eye2.matrix.scale(1, 1, 1);
  eye2.render(); 


  var horn = new Cylinder();
  horn.textureNum = -2;
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
  flipper1.textureNum = -2;
  flipper1.color = [.5, .5, .5, 1];
  flipper1.matrix.translate(0.2, -0.5, -0.3);
  flipper1.matrix.rotate(flipperAngle, 1, 0, 0);
  flipper1.matrix.scale(0.3, 0.05, 0.5);
  flipper1.render();

  var flipper2 = new Cube();
  flipper2.textureNum = -2;
  flipper2.color = [.5, .5, .5, 1];
  flipper2.matrix.translate(-0.5, -0.5, -0.3);
  flipper2.matrix.rotate(-flipperAngle, 1, 0, 0);
  flipper2.matrix.scale(0.3, 0.05, 0.5);
  flipper2.render();


  // this will be the joints
  var tail_base = new Cube();
  tail_base.textureNum = -2;
  tail_base.color = [.5, .5, .5, 1];
  tail_base.matrix.translate(-0.3, -0.5, 0.2);
  tail_base.matrix.scale(0.6, 0.2, 0.5);
  tail_base.render();



  var tail = new Cube();
  tail.textureNum = -2;
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
  tail_tip.textureNum = -2; 
  tail_tip.color = [.5, .5, .5, 1];
  tail_tip.matrix = tailCoordsMat;
  tail_tip.matrix.translate(-1.1, 0.8, 0.4);
  tail_tip.matrix.scale(3, 0.8, 0.8);
  tail_tip.matrix.rotate(tailTipAngle, 0, 1, 0);
  tail_tip.render();
  
  
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
var g_frameCount = 0;
var g_lastFpsUpdateTime = performance.now();
function tick() {
  g_seconds = performance.now()/1000.0 - g_startTime;
  // console.log(g_seconds);
  game();
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

 

  
}   

function initTextures() {
  var image = new Image();  // Create the image object
  var image1 = new Image();
  var image2 = new Image();
  var image3 = new Image();
  var image4 = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  if (!image1) {
    console.log('Failed to create the image1 object');
    return false;
  }
  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }
  if (!image3) {
    console.log('Failed to create the image3 object');
    return false;
  }
  if (!image4) {
    console.log('Failed to create the image4 object');
    return false;
  }
 
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendImageToTEXTURE0(image); };
  image1.onload = function(){ sendImageToTEXTURE1(image1); };
  image2.onload = function(){ sendImageToTEXTURE2(image2); };
  image3.onload = function(){ sendImageToTEXTURE3(image3); };
  image4.onload = function(){ sendImageToTEXTURE4(image4); };
  // Tell the browser to load an image
  image.src = 'grass.png';
  image1.src = 'sky.png';
  image2.src= 'fence.png';
  image3.src = 'tree.png';
  image4.src = 'rock.png';
  // add texture here later

  return true;
}

function sendImageToTEXTURE0(image) {

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  console.log('finished loading textures');
}

function sendImageToTEXTURE1(image) {
   var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0w
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 1 to the sampler
  gl.uniform1i(u_Sampler1, 1);
  
  console.log('finished loading textures');


}

function sendImageToTEXTURE2(image) {
   var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0w
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 2 to the sampler
  gl.uniform1i(u_Sampler2, 2);
  
  console.log('finished loading textures');


}

function sendImageToTEXTURE3(image) {
   var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0w
  gl.activeTexture(gl.TEXTURE3);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 3 to the sampler
  gl.uniform1i(u_Sampler3, 3);
  
  console.log('finished loading textures');


}

function sendImageToTEXTURE4(image) {
   var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0w
  gl.activeTexture(gl.TEXTURE4);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 4 to the sampler
  gl.uniform1i(u_Sampler4, 4);
  
  console.log('finished loading textures');


}

trees_chopped = 0;
function keydown(ev) {
  switch (ev.key) {
    case 'w':
    case 'W':
      g_camera.moveForward(0.2);
      break;
    case 's':
    case 'S':
      g_camera.moveBackwards(0.2);
      break;
    case 'a':
    case 'A':
      g_camera.moveLeft(0.2);
      break;
    case 'd':
    case 'D':
      g_camera.moveRight(0.2);
      break;
    case 'q':
    case 'Q':
      g_camera.panLeft(3); // degrees
      break;
    case 'e':
    case 'E':
      g_camera.panRight(3); // degrees
      break;
    case 'f':
    case 'F':
      for (let i = 0; i < g_blockPositions.length; i++) {
        let block = g_blockPositions[i];
        if (g_map[block.x][block.y] === 0) continue; // already removed

        let dx = block.worldX - g_camera.eye.elements[0];
        let dy = block.worldY - g_camera.eye.elements[1];
        let dz = block.worldZ - g_camera.eye.elements[2];
        let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < 4.0) {
          g_map[block.x][block.y] = 0; // remove from map
          trees_chopped++;
          document.getElementById('game-stats').innerText = "Quest: Delete 10 fences and/or trees to make the animal dance! (Press F) Trees/Fences Deleted: " + trees_chopped;
          console.log(`Removed block at [${block.x}, ${block.y}]`);
          break;  // only remove one per keypress
        }
      }
      break;
  }
}


var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1],
  [1, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 3, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  
];

let g_blockPositions = [];
function drawMap() {
  for (x=0; x<35; x++) {
    for(y=0; y<45; y++) {
      if (g_map[x][y] == 1) {
        var border = new Cube();
        border.color = [1, 1, 1, 1];
        border.textureNum = 2;
        border.matrix.translate(x-20, -0.75, y-20);
        border.render();
        g_blockPositions.push({ type: 1, x: x, y: y, worldX: x - 20, worldY: -0.75, worldZ: y - 20 });
      } 
      else if (g_map[x][y] == 2) {  
        var tree = new Cube();
        tree.textureNum = 3;
        tree.matrix.scale(1, 10, 1);
        tree.matrix.translate(x-20, -0.75, y-20);
        tree.render();
        g_blockPositions.push({ type: 2, x: x, y: y, worldX: x - 20, worldY: -0.75, worldZ: y - 20 });
      }
      else if (g_map[x][y] == 3) {
        var rock = new Cube();
        rock.textureNum = 4;
        rock.matrix.scale(0.5, 0.5, 0.5);
        rock.matrix.translate(x-20, -1.5, y-20);
        rock.render();
        g_blockPositions.push({ type: 3, x: x, y: y, worldX: x - 20, worldY: -1.5, worldZ: y - 20 });
      }
    }
  }
}

let animationTriggered = false;
function game() {
  if (!animationTriggered && trees_chopped >= 10) {
    g_tailAnimation = true;
    g_tailTipAnimation = true;
    g_flipperAnimation = true;
    animationTriggered = true; // Only trigger once
  }
}

let lastMouseX = null;
function mouseCam(ev) {
  if (lastMouseX === null) {
    lastMouseX = ev.clientX;
    return;
  }

  let dx = ev.clientX - lastMouseX;

  if (dx < 0) {
    g_camera.panLeft(-dx * 0.1); // adjust multiplier to control speed
  } else if (dx > 0) {
    g_camera.panRight(dx * 0.1);
  }

  lastMouseX = ev.clientX;
}



function main() {
  
  setupWebGl();
  
  connectVariablesToGLSL();

  addActionsForHtmlUI(); 

  
  g_camera = new Camera();
  document.onkeydown = keydown;
  canvas.onmousemove = function(ev) {
    mouseCam(ev);
  }
  
  

  initTextures();

  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  //canvas.onmousemove = function(ev) { if (ev.buttons == 1) {click(ev)}};
  

  
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // transparency feature
  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // renderAllShapes();

  /*
  canvas.onmousedown = function(ev) {
    if (ev.shiftKey) {
        shiftClicked = true;
        updateAnimationAngles();
    } else {
        g_isDragging = true;
        g_lastMouseX = ev.clientX;
        g_lastMouseY = ev.clientY;
    }
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
  */
  
  requestAnimationFrame(tick);
  
}




