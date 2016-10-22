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

    this.land = new Land(250, 250, this.side, this.river_curve, 100);
    this.land.initBuffers();

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

        //Trees
        for (var i = 0; i < this.trees.length; i++){
            this.trees[i].setupShaders();
            this.trees[i].setupLighting();
            this.trees[i].setIdentity();
            this.trees[i].translate(
                this.tree_positions[3*i],
                this.tree_positions[3*i+1],
                this.tree_positions[3*i+2]
            );
            this.trees[i].draw();
        }
    };

    this.spawnTrees = function() {
        for (var i = -this.side/2; i < this.side/2; i++){
            for (var j = -this.side/2; j < this.side/2 ; j++){
                if (Math.random() < 0.001 &&
                    this.land.on_land(i+(this.side/2), j+(this.side/2))) {
                    var new_tree = new Tree();
                    this.trees.push(new_tree);
                    this.tree_positions.push(i, 0, j);
                }
            }
        }
    };

    this.spawnTrees();
}
