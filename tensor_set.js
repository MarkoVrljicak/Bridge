function TensorSet(data, curve){
    this.tensors = [];
    this.tensor_pos = [];
    this.tensor_top_height = [];
    this.tensor_bottom_height = [];

    var first_point = curve.evaluate(0);
    var last_point = curve.evaluate(1);

    for (var x_spawn = first_point[0] + data.s1; x_spawn < last_point[0]; x_spawn += data.s1){
        var new_tensor = new ColoredCylinder(30, 30);
        new_tensor.initBuffers();
        new_tensor.setUniformColor(.3, .3, .3);
        this.tensors.push(new_tensor);
        this.tensor_pos.push(x_spawn);
        var top_height = curve.evaluate_by_x(x_spawn)[1];
        this.tensor_top_height.push(top_height);
        var bottom_height = data.ph1 + Math.cos((Math.PI/2)*((x_spawn-data.lowest_point[0])/(data.river_width/2)))*data.ph2;
        this.tensor_bottom_height.push(bottom_height);
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
            this.tensors[i].translate(this.tensor_pos[i], this.tensor_bottom_height[i], 0);
            this.tensors[i].scale(.1, this.tensor_top_height[i] - this.tensor_bottom_height[i], .1);
            this.tensors[i].draw();
        }
    };

    this.translate = function(x, y, z) {
        for (var i = 0; i < this.tensors.length; i++){
            this.tensors[i].translate(x, y, z);
        }
    }
}