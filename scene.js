function Scene(){
    this.side = 150;
    this.river_curve = new BezierCurve([
        [this.side/2, 0, 0],
        [2*this.side/3, 0, this.side/4],
        [this.side/3, 0, 3*this.side/4],
        [this.side/2, 0, this.side]
    ]);
    this.river = new River(this.side, 150, 150);
    this.river.initBuffers();

    this.tree = new Tree();

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

        //Tree
        this.tree.draw();
    }
}
