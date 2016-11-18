function Tower(data) {
    this.th1 = data.ph1+(data.ph2/2);
    this.th2 = (data.ph1+data.ph2+data.ph3-this.th1)/2;
    this.th3 = this.th2;

    this.pillars = [
        new Pillar(this.th1, this.th2, this.th3),
        new Pillar(this.th1, this.th2, this.th3)
    ];

    this.width = data.bridge_width;

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        this.pillars[0].setupLighting(lightPosition, ambientColor, diffuseColor);
        this.pillars[1].setupLighting(lightPosition, ambientColor, diffuseColor);
    };

    this.setIdentity = function() {
        this.pillars[0].setIdentity();
        this.pillars[1].setIdentity();
    };

    this.draw = function() {
        this.pillars[0].translate(0, 0, -this.width/2);
        this.pillars[0].draw();
        this.pillars[1].translate(0, 0, this.width/2);
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