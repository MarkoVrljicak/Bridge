function Bridge(river_curve, river_width, z_pos, n_towers, side_len) {
    this.side_len = side_len;
    this.river_curve = river_curve;
    this.z_pos = z_pos;
    this.river_width = river_width;

    this.bridge_width = 15;

    this.n_towers = n_towers;
    this.tower_pos = [];
    this.towers = [];

    this.setTowerPos = function(){
        var lowest_point = this.river_curve.evaluate(this.z_pos/this.side_len);
        switch(this.n_towers){
            case 2:
                this.tower_pos.push([lowest_point[0]-(this.river_width/4), 0, lowest_point[2]]);
                this.tower_pos.push([lowest_point[0]+(this.river_width/4), 0, lowest_point[2]]);
                break;
            default:
                throw "Invalid number of towers";
        }
    };

    this.setTowerPos();

    this.buildTowers = function(){
        for (var i = 0; i < this.n_towers; i++){
            this.towers.push(new Tower(this.bridge_width));
        }
    };

    this.buildTowers();

    this.setupShaders = function(){
        for (var i = 0; i < this.n_towers; i++){
            this.towers[i].setupShaders();
        }
    };

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        for (var i = 0; i < this.n_towers; i++){
            this.towers[i].setupLighting(lightPosition, ambientColor, diffuseColor);
        }

    };

    this.setIdentity = function() {
        for (var i = 0; i < this.n_towers; i++){
            this.towers[i].setIdentity();
        }
    };

    this.draw = function() {
        for (var i = 0; i < this.n_towers; i++){
            this.towers[i].translate(
                this.tower_pos[i][0] - this.side_len/2,
                this.tower_pos[i][1],
                this.tower_pos[i][2]
            );
            this.towers[i].draw();
        }
    };
}