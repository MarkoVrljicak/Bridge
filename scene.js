function Scene(){
    this.side = 300;
    data.side = this.side;
    data.lowest_point = data.river_curve.evaluate_by_z(data.bridge_pos + (data.side/2));
    data.lowest_point[0] -= data.side/2;
    data.lowest_point[2] -= data.side/2;

    this.river = new River(data);
    this.river.initBuffers();
    this.river.initNormalMap(textures.water_normal);
    this.river.initReflectionCube(textures.skybox);

    this.land = new Land(data);

    this.bridge = new Bridge(data);

    this.trees = [];
    this.tree_positions = [];

    this.sky = new TexturedSphere(32, 32);
    var sky_radius = 500;
    this.sky.initBuffers();
    this.sky.initTexture(textures.sky);
    this.sky.material.ambientReflectivity = vec3.fromValues(1, 1, 1);

    // Light settings
    var light = {
        position: vec3.fromValues(-1500, 1500.0, 1500),
        ambient: vec3.fromValues(.4, .4, .4),
        diffuse: vec3.fromValues(1, 1, 1),
        specular: vec3.fromValues(1, 1, 1)
    };

    this.draw = function(){
        //Sky
        if (camera.insideSky(sky_radius)){
            this.sky.setupLighting({
                position: vec3.fromValues(0, 0, 0),
                ambient: vec3.fromValues(1, 1, 1),
                diffuse: vec3.fromValues(0, 0, 0),
                specular: vec3.fromValues(0, 0, 0)
            });
            this.sky.setIdentity();
            this.sky.scale(sky_radius, sky_radius, sky_radius);
            this.sky.draw();
        }

        //Land
        this.land.setupLighting(light);
        this.land.setIdentity();
        this.land.translate(-this.side/2, 0, -this.side/2);
        this.land.draw();

        //Bridge
        this.bridge.setupLighting(light);
        this.bridge.setIdentity();
        this.bridge.draw();

        //Trees
        for (var i = 0; i < this.trees.length; i++){
            this.trees[i].setupLighting(light);
            this.trees[i].setIdentity();
            this.trees[i].translate(
                this.tree_positions[3*i],
                this.tree_positions[3*i+1],
                this.tree_positions[3*i+2]
            );
            this.trees[i].draw();
        }

        //River
        this.river.setupLighting(light);
        this.river.setIdentity();
        this.river.draw();
    };

    this.on_bridge = function(z){
        var margin = 2;
        var left = data.bridge_pos - (this.bridge.getWidth()/2) - margin;
        var right = data.bridge_pos + (this.bridge.getWidth()/2) + margin;
        return left < z && z < right;
    };

    this.spawnTrees = function() {
        var margin = this.side/2;
        for (var i = -margin; i < margin; i++){
            for (var j = -margin; j < margin ; j++){
                if (!this.on_bridge(j) &&
                    this.land.on_land(i+(margin), j+(margin)) &&
                    Math.random() < 0.001) {
                    var new_tree = new Tree();
                    this.trees.push(new_tree);
                    this.tree_positions.push(i, data.ph1, j);
                }
            }
        }
    };

    this.spawnTrees();
}
