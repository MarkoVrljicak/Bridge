function Bridge(data) {
    this.n_towers = data.n_towers;

    this.tower_pos = [];
    this.towers = [];

    this.road = new Road(data);
    this.road.initBuffers();
    this.road.initTexture(textures.asfalt);
    this.road.initTexture(textures.sidewalk);

    this.setTowerPos = function(){
        switch(this.n_towers){
            case 2:
                this.tower_pos.push([data.lowest_point[0]-(data.river_width/4), 0, data.lowest_point[2]]);
                this.tower_pos.push([data.lowest_point[0]+(data.river_width/4), 0, data.lowest_point[2]]);
                break;
            case 3:
                this.tower_pos.push([data.lowest_point[0]-(data.river_width/4), 0, data.lowest_point[2]]);
                this.tower_pos.push([data.lowest_point[0], 0, data.lowest_point[2]]);
                this.tower_pos.push([data.lowest_point[0]+(data.river_width/4), 0, data.lowest_point[2]]);
                break;
            case 4:
                this.tower_pos.push([data.lowest_point[0]-(data.river_width*3/10), 0, data.lowest_point[2]]);
                this.tower_pos.push([data.lowest_point[0]-(data.river_width/10), 0, data.lowest_point[2]]);
                this.tower_pos.push([data.lowest_point[0]+(data.river_width/10), 0, data.lowest_point[2]]);
                this.tower_pos.push([data.lowest_point[0]+(data.river_width*3/10), 0, data.lowest_point[2]]);
                break;
            default:
                throw "Invalid number of towers";
        }
    };
    this.setTowerPos();

    this.support = new Support(data, this.tower_pos);

    this.buildTowers = function(){
        for (var i = 0; i < this.n_towers; i++){
            this.towers.push(new Tower(data));
        }
    };

    this.buildTowers();

    this.setupLighting = function(light){
        this.road.setupLighting(light);
        for (var i = 0; i < this.n_towers; i++){
            this.towers[i].setupLighting(light);
        }
        this.support.setupLighting(light);
    };

    this.setIdentity = function() {
        this.road.setIdentity();
        for (var i = 0; i < this.n_towers; i++){
            this.towers[i].setIdentity();
        }
        this.support.setIdentity();
    };

    this.draw = function() {
        this.road.draw();
        for (var i = 0; i < this.n_towers; i++){
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