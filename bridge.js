function Bridge(data) {
    this.tower_pos = [];
    this.towers = [];

    this.road = new Road(data);
    this.road.initBuffers();

    this.strings = [];

    this.setTowerPos = function(){
        switch(data.n_towers){
            case 2:
                this.tower_pos.push([data.lowest_point[0]-(data.river_width/4), 0, data.lowest_point[2]]);
                this.tower_pos.push([data.lowest_point[0]+(data.river_width/4), 0, data.lowest_point[2]]);
                break;
            default:
                throw "Invalid number of towers";
        }
    };

    this.setTowerPos();

    this.buildTowers = function(){
        for (var i = 0; i < data.n_towers; i++){
            this.towers.push(new Tower(data));
        }
    };

    this.buildTowers();

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
        }
        this.strings.push.apply(this.strings, this.strings.slice());
    };

    this.buildStrings();

    this.setupShaders = function(){
        this.road.setupShaders();
        for (var i = 0; i < data.n_towers; i++){
            this.towers[i].setupShaders();
        }
        for (i = 0; i < this.strings.length; i++){
            this.strings[i].setupShaders();
        }
    };

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        this.road.setupLighting(lightPosition, ambientColor, diffuseColor);
        for (var i = 0; i < data.n_towers; i++){
            this.towers[i].setupLighting(lightPosition, ambientColor, diffuseColor);
        }
        for (i = 0; i < this.strings.length; i++){
            this.strings[i].setupLighting(lightPosition, ambientColor, diffuseColor);
        }
    };

    this.setIdentity = function() {
        this.road.setIdentity();
        for (var i = 0; i < data.n_towers; i++){
            this.towers[i].setIdentity();
        }
        for (i = 0; i < this.strings.length; i++){
            this.strings[i].setIdentity();
        }
    };

    this.draw = function() {
        this.road.draw();
        for (var i = 0; i < data.n_towers; i++){
            this.towers[i].translate(
                this.tower_pos[i][0],
                this.tower_pos[i][1],
                this.tower_pos[i][2]
            );
            this.towers[i].draw();
        }
        for (i = 0; i < this.strings.length; i++){
            if (i < this.strings.length/2) {
                this.strings[i].translate(0, -.5, data.lowest_point[2] - data.bridge_width/2);
            } else {
                this.strings[i].translate(0, 0, data.bridge_width);
            }
            this.strings[i].draw();
        }
    };

    this.getWidth = function() {
        return data.bridge_width;
    }
}