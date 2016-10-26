function Scene(){
    this.side = 300;
    this.river_curve = new BezierCurve([
        [this.side/2, 0, 0],
        [2*this.side/3, 0, this.side/4],
        [this.side/3, 0, 3*this.side/4],
        [this.side/2, 0, this.side]
    ]);

    this.river = new River(this.side, 150, 150);
    this.river.initBuffers();

    this.ground_height = 2;

    this.river_width = 100;
    this.n_towers = 2;
    this.bridge_pos = -10.5;

    this.land = new Land(218, 250, this.side, this.ground_height, this.river_curve, this.river_width);
    this.land.initBuffers();

    this.bridge = new Bridge(
        this.ground_height,
        this.river_curve,
        this.river_width,
        this.bridge_pos,
        this.n_towers,
        this.side
    );

    this.trees = [];
    this.tree_positions = [];

    this.draw = function(){
        //River
        this.river.setupShaders();
        this.river.setupLighting(
            vec3.fromValues(-100.0, 10.0, -60.0),
            vec3.fromValues(0.3, 0.3, 0.3),
            vec3.fromValues(0.05, 0.05, 0.05)
        );
        this.river.setIdentity();
        this.river.draw();

        //Land
        this.land.setupShaders();
        this.land.setupLighting(
            vec3.fromValues(-100.0, 10.0, -60.0),
            vec3.fromValues(0.3, 0.3, 0.3),
            vec3.fromValues(0.05, 0.05, 0.05)
        );
        this.land.setIdentity();
        this.land.translate(-this.side/2, 0, -this.side/2);
        this.land.draw();

        //Bridge
        this.bridge.setupShaders();
        this.bridge.setupLighting(
            vec3.fromValues(-100.0, 10.0, -60.0),
            vec3.fromValues(0.3, 0.3, 0.3),
            vec3.fromValues(0.05, 0.05, 0.05)
        );
        this.bridge.setIdentity();
        this.bridge.draw();

        //Trees
        for (var i = 0; i < this.trees.length; i++){
            this.trees[i].setupShaders();
            this.trees[i].setupLighting(
                vec3.fromValues(-100.0, 10.0, -60.0),
                vec3.fromValues(0.3, 0.3, 0.3),
                vec3.fromValues(0.05, 0.05, 0.05)
            );
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
        return this.bridge_pos < z && z < (this.bridge_pos + this.bridge.getWidth());
    };

    this.spawnTrees = function() {
        var margin = this.side/2 + 1;
        for (var i = -margin; i < margin; i++){
            for (var j = -margin; j < margin ; j++){
                if (!this.on_bridge(j) &&
                    this.land.on_land(i+(margin), j+(margin)) &&
                    Math.random() < 0.001) {
                    var new_tree = new Tree();
                    this.trees.push(new_tree);
                    this.tree_positions.push(i, this.ground_height, j);
                }
            }
        }
    };

    this.spawnTrees();
}
