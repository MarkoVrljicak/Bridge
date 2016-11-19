function Tree() {
    this.trunk = new TexturedCylinder(32, 32);
    this.trunk.initBuffers();
    this.trunk.initTexture(textures.bark);

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

    this.crown = new Crown(curves[Math.floor(Math.random() * curves.length)], 16, 16);
    this.crown.initBuffers();
    this.crown.initTexture(textures.crown);

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor, reflectivity){
        this.trunk.setupLighting(lightPosition, ambientColor, diffuseColor, reflectivity);
        this.crown.setupLighting(lightPosition, ambientColor, diffuseColor, reflectivity);
    };

    this.setIdentity = function() {
        this.trunk.setIdentity();
        this.crown.setIdentity();
    };

    this.draw = function() {
        this.trunk.scale(.6,3,.6);
        this.trunk.draw();
        this.crown.translate(0, 2, 0);
        this.crown.scale(1.5, 1.5, 1.5);
        this.crown.draw();
    };

    this.translate = function(x, y, z){
        this.trunk.translate(x, y, z);
        this.crown.translate(x, y, z);
    }
}