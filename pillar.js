function Pillar(th1, th2, th3) {
    this.h1 = new HSection();
    this.h1.initBuffers();
    this.h1.initTexture(textures.rust);
    this.h2 = new HSection();
    this.h2.initBuffers();
    this.h2.initTexture(textures.rust);
    this.h3 = new HSection();
    this.h3.initBuffers();
    this.h3.initTexture(textures.rust);

    this.t1 = new HTransition();
    this.t1.initBuffers();
    this.t1.initTexture(textures.rust);
    this.t2 = new HTransition();
    this.t2.initBuffers();
    this.t2.initTexture(textures.rust);

    this.cap = new HCap();
    this.cap.initBuffers();
    this.cap.initTexture(textures.rust);

    this.setupLighting = function(lightPosition, ambientColor, diffuseColor){
        this.h1.setupLighting(lightPosition, ambientColor, diffuseColor);
        this.h2.setupLighting(lightPosition, ambientColor, diffuseColor);
        this.h3.setupLighting(lightPosition, ambientColor, diffuseColor);
        this.t1.setupLighting(lightPosition, ambientColor, diffuseColor);
        this.t2.setupLighting(lightPosition, ambientColor, diffuseColor);
        this.cap.setupLighting(lightPosition, ambientColor, diffuseColor);
    };

    this.setIdentity = function() {
        this.h1.setIdentity();
        this.h2.setIdentity();
        this.h3.setIdentity();
        this.t1.setIdentity();
        this.t2.setIdentity();
        this.cap.setIdentity();
    };

    this.draw = function() {
        this.h1.scale(1, th1/3, 1);
        this.h1.draw();

        this.h2.translate(0, th1, 0);
        this.h2.scale(.7, th2/3, .7);
        this.h2.draw();

        this.h3.translate(0, th1 + th2, 0);
        this.h3.scale(.49, th3/3, .49);
        this.h3.draw();

        this.t1.translate(0, th1, 0);
        this.t1.draw();

        this.t2.translate(0, th1 + th2, 0);
        this.t2.scale(.7,.7,.7);
        this.t2.draw();

        this.cap.translate(0, th1 + th2 + th3, 0);
        this.cap.scale(.49, 1, .49);
        this.cap.draw();

    };

    this.translate = function(x, y, z){
        this.h1.translate(x, y, z);
        this.h2.translate(x, y, z);
        this.h3.translate(x, y, z);
        this.t1.translate(x, y, z);
        this.t2.translate(x, y, z);
        this.cap.translate(x, y, z);
    };

    this.scale = function(x, y, z){
        this.h1.scale(x, y, z);
        this.h2.scale(x, y, z);
        this.h3.scale(x, y, z);
        this.t1.scale(x, y, z);
        this.t2.scale(x, y, z);
        this.cap.scale(x, y, z);
    }
}