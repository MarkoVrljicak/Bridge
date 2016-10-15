function Scene(){
    this.bridge = new ColoredCylinder(64, 64);

    this.draw = function(){
        this.bridge.initBuffers();
        this.bridge.draw();
    }
}
