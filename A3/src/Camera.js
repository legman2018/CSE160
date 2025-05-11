class Camera {
    constructor() {
        this.fov = 60;
        this.eye = new Vector3([5,0,0]);
        this.at  = new Vector3([0,0,-1]);
        this.up  = new Vector3([0,1,0]);


        // pass view matrix
        this.viewMat = new Matrix4();
        this.viewMat.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0],  this.at.elements[1],  this.at.elements[2],
            this.up.elements[0],  this.up.elements[1],  this.up.elements[2]
        );

        

        // pass projection matrix
        this.projMat = new Matrix4();
        this.projMat.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        


    }
    moveForward(speed) {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);       
        f.normalize();         
        f.mul(speed);          

        this.eye.add(f);       
        this.at.add(f);        

        this.viewMat.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0],  this.at.elements[1],  this.at.elements[2],
            this.up.elements[0],  this.up.elements[1],  this.up.elements[2]
        );
    }

    moveBackwards(speed) {
        let b = new Vector3();
        b.set(this.eye);
        b.sub(this.at);
        b.normalize();
        b.mul(speed);

        this.eye.add(b);
        this.at.add(b);

        this.viewMat.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0],  this.at.elements[1],  this.at.elements[2],
            this.up.elements[0],  this.up.elements[1],  this.up.elements[2]
        );
    }

    moveLeft(speed) {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        let s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(speed);

        this.eye.add(s);
        this.at.add(s);

        this.viewMat.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0],  this.at.elements[1],  this.at.elements[2],
            this.up.elements[0],  this.up.elements[1],  this.up.elements[2]
        );
    }

    moveRight(speed) {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        let s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(speed);

        this.eye.add(s);
        this.at.add(s);

        this.viewMat.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0],  this.at.elements[1],  this.at.elements[2],
            this.up.elements[0],  this.up.elements[1],  this.up.elements[2]
        );
    }

    panLeft(alpha) {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        let f_prime = rotationMatrix.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime);

        this.viewMat.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0],  this.at.elements[1],  this.at.elements[2],
            this.up.elements[0],  this.up.elements[1],  this.up.elements[2]
        );
    }

    panRight(alpha) {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        let f_prime = rotationMatrix.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime);

        this.viewMat.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0],  this.at.elements[1],  this.at.elements[2],
            this.up.elements[0],  this.up.elements[1],  this.up.elements[2]
        );
    }
    
  

}

