function Bridge(data) {
    this.tower_pos = [];
    this.towers = [];

    this.road = new Road(data);
    this.road.initBuffers();

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

    this.support = new Support(data, this.tower_pos);

    this.buildTowers = function(){
        for (var i = 0; i < data.n_towers; i++){
            this.towers.push(new Tower(data));
        }
    };

    this.buildTowers();

    this.setupShaders = function(){
        this.road.setupShaders();
        for (var i = 0; i < data.n_towers; i++){
            this.towers[i].setupShaders();
        }
        this.support.setupShaders();
    };

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        this.road.setupLighting(lightPosition, ambientColor, diffuseColor);
        for (var i = 0; i < data.n_towers; i++){
            this.towers[i].setupLighting(lightPosition, ambientColor, diffuseColor);
        }
        this.support.setupLighting(lightPosition, ambientColor, diffuseColor);
    };

    this.setIdentity = function() {
        this.road.setIdentity();
        for (var i = 0; i < data.n_towers; i++){
            this.towers[i].setIdentity();
        }
        this.support.setIdentity();
    };

    this.draw = function() {
        this.road.scale(1, 1, 1.05);
        this.road.draw();
        for (var i = 0; i < data.n_towers; i++){
            this.towers[i].translate(
                this.tower_pos[i][0],
                this.tower_pos[i][1],
                this.tower_pos[i][2]
            );
            this.towers[i].draw();
        }
        this.support.draw();
    };

    this.getWidth = function() {
        return data.bridge_width;
    }
}