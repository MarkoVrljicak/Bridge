function Support(data, tower_pos){
    this.tower_pos = tower_pos;
    this.wires = [];
    this.left_tensor_set = [];
    this.right_tensor_set = [];

    this.buildWires = function() {
        var curve;
        for (var i = 0; i <= this.tower_pos.length; i++){
            if (!i){
                curve = new BezierCurve(
                    [
                        [data.lowest_point[0]-data.river_width/2, data.ph1 + 1, 0],
                        [((data.lowest_point[0]-data.river_width/2)+this.tower_pos[i][0])/2, data.ph1 + data.ph2, 0],
                        [this.tower_pos[i][0], data.ph1 + data.ph2 + data.ph3, 0]
                    ]
                )
            } else if (i == this.tower_pos.length){
                curve = new BezierCurve(
                    [
                        [this.tower_pos[i-1][0], data.ph1 + data.ph2 + data.ph3, 0],
                        [((data.lowest_point[0]+data.river_width/2)+this.tower_pos[i-1][0])/2, data.ph1 + data.ph2, 0],
                        [data.lowest_point[0]+data.river_width/2, data.ph1 + 1, 0]
                    ]
                );
            } else {
                curve = new BezierCurve(
                    [
                        [this.tower_pos[i-1][0], data.ph1 + data.ph2 + data.ph3, 0],
                        [(this.tower_pos[i-1][0] + this.tower_pos[i][0])*.5, data.ph1+data.ph2, 0],
                        [(this.tower_pos[i-1][0] + this.tower_pos[i][0])*.5, data.ph1+data.ph2, 0],
                        [this.tower_pos[i][0], data.ph1 + data.ph2 + data.ph3, 0]
                    ]
                )
            }
            this.wires.push(new Wire(curve, 64, 64));
            this.wires[i].initBuffers();
            this.wires[i].initNormalMap(textures.wire);
            this.wires[i].initReflectionCube(textures.skybox);
            this.left_tensor_set.push(new TensorSet(data, curve));
            this.right_tensor_set.push(new TensorSet(data, curve));
        }
        this.wires.push.apply(this.wires, this.wires.slice());
    };

    this.buildWires();

    this.setupLighting = function(light){
        for (var i = 0; i < this.wires.length; i++){
            this.wires[i].setupLighting(light);
            if (i < this.wires.length/2) {
                this.left_tensor_set[i].setupLighting(light);
                this.right_tensor_set[i].setupLighting(light);
            }
        }
    };

    this.setIdentity = function(){
        for (var i = 0; i < this.wires.length; i++){
            this.wires[i].setIdentity();
            if (i < this.wires.length/2) {
                this.left_tensor_set[i].setIdentity();
                this.right_tensor_set[i].setIdentity();
            }
        }
    };

    this.draw = function(){
        for (var i = 0; i < this.wires.length; i++){
            if (i < this.wires.length/2) {
                this.wires[i].translate(0, -.5, data.lowest_point[2] - data.bridge_width/2);
                this.left_tensor_set[i].translate(0, -.5, data.lowest_point[2] - data.bridge_width/2);
                this.right_tensor_set[i].translate(0, -.5, data.lowest_point[2] + data.bridge_width/2);
                this.left_tensor_set[i].draw();
                this.right_tensor_set[i].draw();
            } else {
                this.wires[i].translate(0, 0, data.bridge_width);
            }
            this.wires[i].draw();
        }
    }
}
