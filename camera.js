function Camera(){
    this.eye_point = vec3.create();

    this.insideSky = function(radius){
        return vec3.length(this.eye_point) < radius;
    }
}