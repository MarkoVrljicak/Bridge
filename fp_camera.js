function FPCamera(data){
    Camera.call(this);

    vec3.set(this.eye_point, -150, data.ph1 + data.ph2 + 1.8, data.bridge_pos);
    this.at_point = vec3.create();
    this.up_point = vec3.create();
    vec3.set(this.up_point, 0, 1, 0);

    this.sight_direction = vec3.fromValues(1, 0, 0);

    this.update = function() {
        this.move(ahead, sideways);
        mat4.lookAt(camera_matrix, this.eye_point, vec3.add(this.at_point, this.eye_point, this.sight_direction), this.up_point);
    };

    this.zoom = function(speed){};

    this.pan = function(x_speed, y_speed){
        var sensibility = 150;

        var m = mat4.create();
        mat4.identity(m);
        mat4.rotate(m, m, -x_speed/sensibility, this.up_point);

        var axis = vec3.create();
        vec3.cross(axis, this.up_point, this.sight_direction);

        mat4.rotate(m, m, y_speed/sensibility, axis);
        vec3.transformMat4(this.sight_direction, this.sight_direction, m);
    };

    this.move = function(ahead, sideways){
        var direction = vec3.create();
        var v_ahead = vec3.create();
        var v_sideways = vec3.create();
        vec3.scale(v_ahead, this.sight_direction, ahead);
        vec3.cross(v_sideways, this.up_point, this.sight_direction);
        vec3.scale(v_sideways, v_sideways, -sideways);
        vec3.add(direction, v_ahead, v_sideways);
        direction[1] = 0;
        vec3.add(this.eye_point, this.eye_point, direction);
    };

    this.onWheel = function(e) {};

    this.onMovement = function(e){
        var X = e.pageX;
        var Y = e.pageY;
        if (lastMouseX || lastMouseY) {
            var delta_x = X - lastMouseX;
            var delta_y = Y - lastMouseY;
            camera.pan(delta_x, delta_y);
        }
        lastMouseX = X;
        lastMouseY = Y;
    }

}