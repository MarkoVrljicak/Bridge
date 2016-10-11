function OrbitalCamera(){
    this.height = 75;
    this.eye_point = vec3.create();
    vec3.set(this.eye_point, 40, this.height, -100);
    this.at_point = vec3.create();
    vec3.set(this.at_point, 0, 0, 0);
    this.up_point = vec3.create();
    vec3.set(this.up_point, 0, 1, 0);

    this.update = function() {
        mat4.lookAt(CameraMatrix, this.eye_point, this.at_point, this.up_point);
    };

    this.pan = function(speed){
        var direction = vec3.create();
        vec3.normalize(direction, this.eye_point); //Supone que at_point no sale nunca del origen.
        vec3.add(this.eye_point, vec3.scale(direction, direction, speed), this.eye_point);
        this.height = this.eye_point[1];
    };

    this.orbit = function(speed){
        var orbit_radius_vector = vec2.create();
        orbit_radius_vector[0] = this.eye_point[0];
        orbit_radius_vector[1] = this.eye_point[2];
        var orbit_radius_length = vec2.length(orbit_radius_vector);
        // Move
        var direction = vec3.create();
        vec3.cross(direction, this.eye_point, this.up_point);
        vec3.normalize(direction, direction);
        vec3.add(this.eye_point, vec3.scale(direction, direction, speed), this.eye_point);
        // Correct
        this.eye_point[1] = this.height;
        var uncorrected = vec2.create();
        uncorrected[0] = this.eye_point[0];
        uncorrected[1] = this.eye_point[2];
        var scale_factor = orbit_radius_length/vec2.length(uncorrected);
        vec2.scale(uncorrected, uncorrected, scale_factor);
        this.eye_point[0] = uncorrected[0];
        this.eye_point[2] = uncorrected[1];
    };

    this.onWheel = function(e) {
        var sensibility = 7;
        var e = window.event || e;
        e.preventDefault();
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        camera.pan(-sensibility*delta);
    };

    this.onMovement = function(e){
        if (mouseDown) {
            var X = e.pageX;
            if (lastMouseX) {
                var delta = X - lastMouseX;
                camera.orbit(delta);
            }
            lastMouseX = X;
        }

    }

}
