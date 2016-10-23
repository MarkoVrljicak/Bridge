function Tower(width) {
    this.pillars = [
        new Pillar(10, 10, 10),
        new Pillar(10, 10, 10)
    ];

    this.width = width;

    this.setupShaders = function(){
        this.pillars[0].setupShaders();
        this.pillars[1].setupShaders();
    };

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        this.pillars[0].setupLighting(lightPosition, ambientColor, diffuseColor);
        this.pillars[1].setupLighting(lightPosition, ambientColor, diffuseColor);
    };

    this.setIdentity = function() {
        this.pillars[0].setIdentity();
        this.pillars[1].setIdentity();
    };

    this.draw = function() {
        this.pillars[0].draw();
        this.pillars[1].translate(0, 0, this.width);
        this.pillars[1].draw();
    };

    this.translate = function(x, y, z){
        this.pillars[0].translate(x, y, z);
        this.pillars[1].translate(x, y, z);
    };

    this.scale = function(x, y, z){
        this.pillars[0].scale(x, y, z);
        this.pillars[1].scale(x, y, z);
    }
}