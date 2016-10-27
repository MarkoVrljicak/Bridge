function TensorSet(data, curve){
    this.tensors = [];
    this.tensor_pos = [];
    this.tensor_height = [];

    var first_point = curve.evaluate(0);
    var last_point = curve.evaluate(1);

    for (var x_spawn = first_point[0] + data.s1; x_spawn < last_point[0]; x_spawn += data.s1){
        var new_tensor = new ColoredCylinder(30, 30);
        new_tensor.initBuffers();
        new_tensor.setUniformColor(.3, .3, .3);
        this.tensors.push(new_tensor);
        this.tensor_pos.push(x_spawn);
        this.tensor_height.push(curve.evaluate((x_spawn-first_point[0])/(last_point[0]-first_point[0]))[1]);
    }

    this.setIdentity = function(){
        for (var i = 0; i < this.tensors.length; i++){
            this.tensors[i].setIdentity();
        }
    };

    this.setupShaders = function(){
        for (var i = 0; i < this.tensors.length; i++){
            this.tensors[i].setupShaders();
        }
    };

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        for (var i = 0; i < this.tensors.length; i++){
            this.tensors[i].setupLighting(lightPosition, ambientColor, diffuseColor);
        }
    };

    this.draw = function(){
        for (var i = 0; i < this.tensors.length; i++){
            this.tensors[i].translate(this.tensor_pos[i], 0, 0);
            this.tensors[i].scale(.1, this.tensor_height[i], .1);
            this.tensors[i].draw();
        }
    };

    this.translate = function(x, y, z) {
        for (var i = 0; i < this.tensors.length; i++){
            this.tensors[i].translate(x, y, z);
        }
    }
}