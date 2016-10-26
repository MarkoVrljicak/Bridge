function Scene(){
    this.side = 300;
    var data = {
        side : this.side,
        river_curve : new BezierCurve([
            [this.side/2, 0, 0],
            [2*this.side/3, 0, this.side/4],
            [this.side/3, 0, 3*this.side/4],
            [this.side/2, 0, this.side]
        ]),
        ph1 : 4, // Ground height
        ph2 : 6, // Max road height
        river_width : 100,
        n_towers : 2,
        bridge_pos : 0,
        bridge_width : 15
    };
    data.lowest_point = data.river_curve.evaluate((data.bridge_pos + (data.side/2))/data.side);
    data.lowest_point[0] -= data.side/2;
    data.lowest_point[2] -= data.side/2;

    this.guide = new Guide();
    this.guide.initBuffers();

    this.river = new River(data);
    this.river.initBuffers();

    this.land = new Land(data);
    this.land.initBuffers();

    this.bridge = new Bridge(data);

    this.trees = [];
    this.tree_positions = [];

    this.draw = function(){
        this.guide.draw();

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
        var margin = 2;
        var left = data.bridge_pos - (this.bridge.getWidth()/2) - margin;
        var right = data.bridge_pos + (this.bridge.getWidth()/2) + margin;
        return left < z && z < right;
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
                    this.tree_positions.push(i, data.ph1, j);
                }
            }
        }
    };

    this.spawnTrees();
}
