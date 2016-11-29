function Geometry() {
    this.model_matrix = mat4.create();

    this.shader = null;

    this.material = {
        //Default values
        ambientReflectivity: vec3.fromValues(.5, .5, .5),
        diffuseReflectivity: vec3.fromValues(.5, .5, .5),
        specularReflectivity: vec3.fromValues(.5, .5, .5),
        shininess: 1.0
    };

    this.setupShaders = function(){
        gl.useProgram(this.shader);
    };

    this.setIdentity = function(){
        mat4.identity(this.model_matrix);
    };

    this.translate = function(x, y, z){
        mat4.translate(this.model_matrix, this.model_matrix, vec3.fromValues(x, y, z));
    };

    this.scale = function(x, y, z){
        mat4.scale(this.model_matrix, this.model_matrix, vec3.fromValues(x, y, z));
    };

    this.rotate = function(x, y, z, deg){
        mat4.rotate(this.model_matrix, this.model_matrix, degToRad(deg),vec3.fromValues(x, y, z));
    };
}