function Scene(){
    this.bridge = new ColoredCylinder(64, 64);
    this.bridge.initBuffers();

    this.ob = new ColoredCylinder(5, 5);
    this.ob.initBuffers();

    this.draw = function(){
        //Bridge
        this.bridge.setupShaders();
        this.bridge.setupLighting(
            vec3.fromValues(-100.0, 0.0, -60.0),
            vec3.fromValues(0.3, 0.3, 0.3),
            vec3.fromValues(0.05, 0.05, 0.05)
        );
        this.bridge.setIdentity();
        this.bridge.scale(7,7,7);
        this.bridge.translate(1,1,1);
        this.bridge.setUniformColor(.1,1,1);
        this.bridge.draw();

        //Bridge
        this.ob.setupShaders();
        this.ob.setupLighting(
            vec3.fromValues(-100.0, 0.0, -60.0),
            vec3.fromValues(0.3, 0.3, 0.3),
            vec3.fromValues(0.05, 0.05, 0.05)
        );
        this.ob.setIdentity();
        this.ob.scale(7,7,7);
        this.ob.draw();
    }
}
