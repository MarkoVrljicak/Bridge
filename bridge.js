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
        this.strings.push(
            new ColoredString(
                new BezierCurve([
                    [-25, 30, 0],
                    [-12.5, 0, 0],
                    [12.5, 0, 0],
                    [25, 30, 0]
                ]),
                250,
                250
            )
        );
        this.strings[0].initBuffers();
    };

    this.buildStrings();

    this.setupShaders = function(){
        this.road.setupShaders();
        for (var i = 0; i < data.n_towers; i++){
            this.towers[i].setupShaders();
        }
        this.strings[0].setupShaders();
    };

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        this.road.setupLighting(lightPosition, ambientColor, diffuseColor);
        for (var i = 0; i < data.n_towers; i++){
            this.towers[i].setupLighting(lightPosition, ambientColor, diffuseColor);
        }
        this.strings[0].setupLighting(lightPosition, ambientColor, diffuseColor);

    };

    this.setIdentity = function() {
        this.road.setIdentity();
        for (var i = 0; i < data.n_towers; i++){
            this.towers[i].setIdentity();
        }
        this.strings[0].setIdentity();
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
        this.strings[0].translate(0, 20, 0);
        this.strings[0].draw();
    };

    this.getWidth = function() {
        return data.bridge_width;
    }
}