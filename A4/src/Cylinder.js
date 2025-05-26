// used AI for this class. not mine
class Cylinder {
    constructor() {
        this.type = 'cylinder';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.segments = 20; // You can adjust how smooth it looks
    }

    render() {
        var rgba = this.color;

        // Send cylinder's matrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // --------- Draw Sides ---------
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        for (let i = 0; i < this.segments; i++) {
            let angle1 = (i * 2 * Math.PI) / this.segments;
            let angle2 = ((i + 1) * 2 * Math.PI) / this.segments;

            let x1 = Math.cos(angle1) * 0.5;
            let z1 = Math.sin(angle1) * 0.5;
            let x2 = Math.cos(angle2) * 0.5;
            let z2 = Math.sin(angle2) * 0.5;

            // side rectangles (split into two triangles)
            drawTriangle3D([x1, 0, z1, x2, 0, z2, x1, 1, z1]);
            drawTriangle3D([x1, 1, z1, x2, 0, z2, x2, 1, z2]);
        }

        // --------- Draw Top ---------
        gl.uniform4f(u_FragColor, rgba[0] * 1.2, rgba[1] * 1.2, rgba[2] * 1.2, rgba[3]);
        for (let i = 0; i < this.segments; i++) {
            let angle1 = (i * 2 * Math.PI) / this.segments;
            let angle2 = ((i + 1) * 2 * Math.PI) / this.segments;

            let x1 = Math.cos(angle1) * 0.5;
            let z1 = Math.sin(angle1) * 0.5;
            let x2 = Math.cos(angle2) * 0.5;
            let z2 = Math.sin(angle2) * 0.5;

            // top triangles (fan shape)
            drawTriangle3D([0, 1, 0, x1, 1, z1, x2, 1, z2]);
        }

        // --------- Draw Bottom ---------
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        for (let i = 0; i < this.segments; i++) {
            let angle1 = (i * 2 * Math.PI) / this.segments;
            let angle2 = ((i + 1) * 2 * Math.PI) / this.segments;

            let x1 = Math.cos(angle1) * 0.5;
            let z1 = Math.sin(angle1) * 0.5;
            let x2 = Math.cos(angle2) * 0.5;
            let z2 = Math.sin(angle2) * 0.5;

            // bottom triangles (fan shape)
            drawTriangle3D([0, 0, 0, x2, 0, z2, x1, 0, z1]);
        }
    }
}
