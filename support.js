function Support(data, tower_pos){
    this.tower_pos = tower_pos;
    this.strings = [];
    this.tensor_sets = [];

    this.buildStrings = function() {
        var curve;
        for (var i = 0; i <= this.tower_pos.length; i++){
            if (!i){
                curve = new BezierCurve(
                    [
                        [data.lowest_point[0]-data.river_width/2, data.ph1, 0],
                        [(this.tower_pos[i][0]-(data.river_width/2))*(1/2), data.ph1 + data.ph2, 0],
                        [(this.tower_pos[i][0]-(data.river_width/2))*(1/2), data.ph1 + data.ph2, 0],
                        [this.tower_pos[i][0], data.ph1 + data.ph2 + data.ph3, 0]
                    ]
                )
            } else if (i == this.tower_pos.length){
                curve = new BezierCurve(
                    [
                        [this.tower_pos[i-1][0], data.ph1 + data.ph2 + data.ph3, 0],
                        [(this.tower_pos[i-1][0]+(data.river_width/2))*(1/2), data.ph1 + data.ph2, 0],
                        [(this.tower_pos[i-1][0]+(data.river_width/2))*(1/2), data.ph1 + data.ph2, 0],
                        [data.lowest_point[0]+data.river_width/2, data.ph1, 0]
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
            this.strings.push(new ColoredString(curve, 250, 250));
            this.strings[i].initBuffers();
            this.tensor_sets.push(new TensorSet(data, curve));
        }
        this.strings.push.apply(this.strings, this.strings.slice());
        this.tensor_sets.push.apply(this.tensor_sets, this.tensor_sets.slice());
    };

    this.buildStrings();

    this.setupShaders = function(){
        for (var i = 0; i < this.strings.length; i++){
            this.strings[i].setupShaders();
            this.tensor_sets[i].setupShaders();
        }
    };

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        for (var i = 0; i < this.strings.length; i++){
            this.strings[i].setupLighting(lightPosition, ambientColor, diffuseColor);
            this.tensor_sets[i].setupLighting(lightPosition, ambientColor, diffuseColor);
        }
    };

    this.setIdentity = function(){
        for (var i = 0; i < this.strings.length; i++){
            this.strings[i].setIdentity();
            this.tensor_sets[i].setIdentity();
        }
    };

    this.draw = function(){
        for (var i = 0; i < this.strings.length; i++){
            if (i < this.strings.length/2) {
                this.strings[i].translate(0, -.5, data.lowest_point[2] - data.bridge_width/2);
                this.tensor_sets[i].translate(0, -.5, data.lowest_point[2] - data.bridge_width/2);
            } else {
                this.strings[i].translate(0, 0, data.bridge_width);
                //this.tensor_sets[i].translate(0, 0, data.bridge_width);
            }
            this.strings[i].draw();
        }
        for (i = 0; i < this.strings.length/2; i++){
            this.tensor_sets[i].draw();
        }
    }
}