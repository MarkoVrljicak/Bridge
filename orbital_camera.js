function OrbitalCamera(){
    Camera.call(this);

    this.height = 200;
    vec3.set(this.eye_point, -200, this.height, -200);
    this.at_point = vec3.create();
    vec3.set(this.at_point, 0, 0, 0);
    this.up_point = vec3.create();
    vec3.set(this.up_point, 0, 1, 0);

    this.update = function() {
        mat4.lookAt(camera_matrix, this.eye_point, this.at_point, this.up_point);
    };

    this.zoom = function(speed){
        var direction = vec3.create();
        vec3.normalize(direction, this.eye_point); //Supone que at_point no sale nunca del origen.
        vec3.add(this.eye_point, vec3.scale(direction, direction, speed), this.eye_point);
        this.height = this.eye_point[1];
    };

    this.pan = function(x_speed, y_speed){
        var sensibility = 150;

        var m = mat4.create();
        mat4.identity(m);
        mat4.rotate(m, m, -x_speed/sensibility, this.up_point);

        var axis = vec3.create();
        vec3.cross(axis, this.up_point, this.eye_point);

        mat4.rotate(m, m, -y_speed/sensibility, axis);
        vec3.transformMat4(this.eye_point, this.eye_point, m);
    };

    this.onWheel = function(e) {
        var sensibility = 7;
        var e = window.event || e;
        e.preventDefault();
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        camera.zoom(-sensibility*delta);
    };

    this.onMovement = function(e){
        if (mouseDown) {
            var X = e.pageX;
            var Y = e.pageY;
            if (lastMouseX) {
                var delta_x = X - lastMouseX;
                var delta_y = Y - lastMouseY;
                camera.pan(delta_x, delta_y);
            }
            lastMouseX = X;
            lastMouseY = Y;
        }

    }

}
