// (step 2)
// drawVector() function
function drawVector(v, color) {
    var canvas = document.getElementById('example')
    var ctx = canvas.getContext('2d')
    
    const x = v.elements[0] * 20
    const y = v.elements[1] * 20

    ctx.beginPath()
    ctx.moveTo(200, 200)
    ctx.lineTo(200 + x, 200 - y)
    ctx.strokeStyle = color
    ctx.stroke()
}


// (step 3 and 4)
function handleDrawEvent() {
    var canvas = document.getElementById('example')
    var ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const x1 = document.getElementById('x1Coordinate').value
    const y1 = document.getElementById('y1Coordinate').value
    const x2 = document.getElementById('x2Coordinate').value
    const y2 = document.getElementById('y2Coordinate').value
    
    const v1 = new Vector3([x1, y1, 0])
    const v2 = new Vector3([x2, y2, 0])
    
    drawVector(v1, 'red')
    drawVector(v2, 'blue')
}

// (step 7)
function angleBetween(v1, v2) {
    const dot = Vector3.dot(v1, v2)
    const m1 = v1.magnitude()
    const m2 = v2.magnitude()
    const radians = Math.acos(dot / (m1 * m2))
    return radians * (180 / Math.PI)
}
// (step 8)
function areaTriangle(v1, v2) {
    const cross = Vector3.cross(v1, v2)
    const area = 0.5 * cross.magnitude()
    return area
}
// (step 5, 6, 7, 8)
function handleDrawOperationEvent() {
    const canvas = document.getElementById('example')
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const x1 = document.getElementById('x1Coordinate').value
    const y1 = document.getElementById('y1Coordinate').value
    const x2 = document.getElementById('x2Coordinate').value
    const y2 = document.getElementById('y2Coordinate').value
    
    const v1 = new Vector3([x1, y1, 0])
    const v2 = new Vector3([x2, y2, 0])

    const op = document.getElementById('operation').value
    const scalar = document.getElementById('scalarInput').value
    
    drawVector(v1, "red")
    drawVector(v2, "blue")
    if (op === 'add') {
        const v3 = new Vector3(v1.elements).add(v2)
        drawVector(v3, 'green')
    } else if (op === 'sub') {
        const v3 = new Vector3(v1.elements).sub(v2)
        drawVector(v3, 'green')
    } else if (op === 'mul') {
        const v3 = new Vector3(v1.elements).mul(scalar)
        const v4 = new Vector3(v2.elements).mul(scalar)
        drawVector(v3, 'green')
        drawVector(v4, 'green')
    } else if (op === 'div') {
        const v3 = new Vector3(v1.elements).div(scalar)
        const v4 = new Vector3(v2.elements).div(scalar)
        drawVector(v3, 'green')
        drawVector(v4, 'green')
    } else if (op == 'mag') {
        console.log('Magnitude v1: ', v1.magnitude())
        console.log('Magnitude v2: ', v2.magnitude())
    } else if (op == 'norm') {
        const norm1 = new Vector3(v1.elements).normalize()
        const norm2 = new Vector3(v2.elements).normalize()
        drawVector(norm1, 'green')
        drawVector(norm2, 'green')
    } else if (op == 'angle') {
        const angle = angleBetween(v1, v2);
        console.log("Angle: ", angle);
    } else if(op == 'area') {
        const area = areaTriangle(v1 , v2)
        console.log("Area of the triangle: ", area)
    }

}




function main() {
    var canvas = document.getElementById('example')
    if (!canvas) {
        console.log('Failed to retrieve <canvas> element')
        return
    }

    var ctx = canvas.getContext('2d')
    
    // (step 2)
    // creating red vector v1 and black canvas
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let v1 = new Vector3([2.25, 2.25, 0])
    drawVector(v1, 'red')
    
}


