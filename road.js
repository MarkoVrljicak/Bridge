function Road(data){
    this.sidewalk = new Sidewalk(data);
    this.sidewalk.initBuffers();
    this.sidewalk.initTexture(textures.road.sidewalk.color);
    this.sidewalk.initNormalMap(textures.road.sidewalk.normal);

    this.street = new Street(data);
    this.street.initBuffers();
    this.street.initTexture(textures.road.street.color);
    this.street.initNormalMap(textures.road.street.normal);

    this.setupLighting = function(light){
        this.sidewalk.setupLighting(light);
        this.street.setupLighting(light);
    };

    this.setIdentity = function() {
        this.sidewalk.setIdentity();
        this.street.setIdentity();
    };

    this.draw = function() {
        this.sidewalk.draw();
        this.street.draw();
    };

    this.translate = function(x, y, z){
        this.street.translate(x, y, z);
        this.sidewalk.translate(x, y, z);
    }
}