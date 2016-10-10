function OrbitalCamera(){
    this.eye_point = vec3.create();
    vec3.set(this.eye_point, 40, 75, -100);
    this.at_point = vec3.create();
    vec3.set(this.at_point, 0, 0, 0);
    this.up_point = vec3.create();
    vec3.set(this.up_point, 0, 1, 0);

    this.update = function(){
        mat4.lookAt(CameraMatrix, this.eye_point, this.at_point, this.up_point);
    };

    this.pan = function(speed){
        var direction = vec3.create();
        vec3.normalize(direction, this.eye_point); //Supone que at_point no sale nunca del origen.
        vec3.add(this.eye_point, vec3.scale(direction, direction, speed), this.eye_point);
    };

    this.orbit = function(speed){
        var direction = vec3.create();
        vec3.cross(direction, this.eye_point, this.up_point);
        vec3.normalize(direction, direction);
        vec3.add(this.eye_point, vec3.scale(direction, direction, speed), this.eye_point);
    };

    this.onWheel = function(e) {
        var e = window.event || e;
        e.preventDefault();
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        camera.pan(-5*delta);
    }

}
