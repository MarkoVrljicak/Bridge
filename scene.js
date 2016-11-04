function Scene(){
    this.side = 300;
    data.side = this.side;
    data.lowest_point = data.river_curve.evaluate_by_z(data.bridge_pos + (data.side/2));
    data.lowest_point[0] -= data.side/2;
    data.lowest_point[2] -= data.side/2;

    this.river = new River(data);
    this.river.initBuffers();

    this.land = new Land(data);
    this.land.initBuffers();

    this.bridge = new Bridge(data);

    this.trees = [];
    this.tree_positions = [];

    this.draw = function(){
        var light_position = vec3.fromValues(-150, 150.0, 150);
        var ambient_color = vec3.fromValues(0.3, 0.3, 0.3);
        var diffuse_color = vec3.fromValues(0.01, 0.01, 0.01);

        //River
        this.river.setupShaders();
        this.river.setupLighting(light_position, ambient_color, diffuse_color);
        this.river.setIdentity();
        this.river.draw();

        //Land
        this.land.setupShaders();
        this.land.setupLighting(light_position, ambient_color, diffuse_color);
        this.land.setIdentity();
        this.land.translate(-this.side/2, 0, -this.side/2);
        this.land.draw();

        //Bridge
        this.bridge.setupShaders();
        this.bridge.setupLighting(light_position, ambient_color, diffuse_color);
        this.bridge.setIdentity();
        this.bridge.draw();

        //Trees
        for (var i = 0; i < this.trees.length; i++){
            this.trees[i].setupShaders();
            this.trees[i].setupLighting(light_position, ambient_color, diffuse_color);
            this.trees[i].setIdentity();
            this.trees[i].translate(
                this.tree_positions[3*i],
                this.tree_positions[3*i+1],
                this.tree_positions[3*i+2]
            );
            this.trees[i].draw();
        }
    };

    this.on_bridge = function(z){
        var margin = 2;
        var left = data.bridge_pos - (this.bridge.getWidth()/2) - margin;
        var right = data.bridge_pos + (this.bridge.getWidth()/2) + margin;
        return left < z && z < right;
    };

    this.spawnTrees = function() {
        var margin = this.side/2;
        for (var i = -margin; i < margin; i++){
            for (var j = -margin; j < margin ; j++){
                if (!this.on_bridge(j) &&
                    this.land.on_land(i+(margin), j+(margin)) &&
                    Math.random() < 0.001) {
                    var new_tree = new Tree();
                    this.trees.push(new_tree);
                    this.tree_positions.push(i, data.ph1, j);
                }
            }
        }
    };

    this.spawnTrees();
}
