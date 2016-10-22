function Tree() {
    this.trunk = new ColoredCylinder(32, 32);
    this.trunk.initBuffers();
    this.trunk.setUniformColor(.4, .15, 0);

    var curves = [
        new BezierCurve([
            [0, 0, 0],
            [1, 1, 0],
            [1, 2, 0],
            [0, 3, 0]
        ]),
        new BezierCurve([
            [0, 0, 0],
            [1, 1, 0],
            [1, 2, 0],
            [0, 4, 0]
        ]),
        new BezierCurve([
            [0, 0, 0],
            [1, 1, 0],
            [2, 2, 0],
            [0, 2, 0]
        ])
    ];

    this.crown = new Crown(curves[Math.floor(Math.random() * curves.length)], 8, 8);
    this.crown.initBuffers();

    this.setupShaders = function(){
        this.trunk.setupShaders();
        this.crown.setupShaders();
    };

    this.setupLighting = function(){
        this.trunk.setupLighting(
            vec3.fromValues(-100.0, 0.0, -60.0),
            vec3.fromValues(0.3, 0.3, 0.3),
            vec3.fromValues(0.05, 0.05, 0.05)
        );
        this.crown.setupLighting(
            vec3.fromValues(-100.0, 0.0, -60.0),
            vec3.fromValues(0.3, 0.3, 0.3),
            vec3.fromValues(0.05, 0.05, 0.05)
        );
    };

    this.setIdentity = function() {
        this.trunk.setIdentity();
        this.crown.setIdentity();
    };

    this.draw = function() {
        this.trunk.scale(.8,4,.8);
        this.trunk.draw();
        this.crown.translate(0, 3, 0);
        this.crown.scale(2, 2, 2);
        this.crown.draw();
    };

    this.translate = function(x, y, z){
        this.trunk.translate(x, y, z);
        this.crown.translate(x, y, z);
    }
}