function Scene(){
    this.side = 300;
    data.side = this.side;
    data.lowest_point = data.river_curve.evaluate_by_z(data.bridge_pos + (data.side/2));
    data.lowest_point[0] -= data.side/2;
    data.lowest_point[2] -= data.side/2;

    this.river = new River(data);
    this.river.initBuffers();

    this.land = new Land(data);
    this.land.initBuffers();

    this.bridge = new Bridge(data);

    this.trees = [];
    this.tree_positions = [];

    this.sky = new TexturedSphere(30, 30);
    var sky_radius = 500;
    this.sky.initBuffers();
    this.sky.initTexture(textures.sky);

    // Light settings
    var std_light_position = vec3.fromValues(-1500, 1500.0, 1500);
    var std_ambient_color = vec3.fromValues(.2, .2, .2);
    var std_diffuse_color = vec3.fromValues(0.001, 0.001, 0.001);

    var full_reflectivity = vec3.fromValues(1, 1, 1);
    var rust_reflectivity = vec3.fromValues(.6, .6, .6);
    var tree_reflectivity = vec3.fromValues(.5, .5, .5);

    var full_shininess = vec3.fromValues(.1, .1, .1);
    var no_shininess = vec3.fromValues(0, 0, 0);

    this.draw = function(){
        //Sky
        if (camera.insideSky(sky_radius)){
            this.sky.setupLighting(
                vec3.fromValues(0, 0, 0),
                vec3.fromValues(0.9, 0.9, 0.9),
                vec3.fromValues(0.01, 0.01, 0.01),
                full_reflectivity,
                no_shininess
            );
            this.sky.setIdentity();
            this.sky.scale(sky_radius, sky_radius, sky_radius);
            this.sky.draw();
        }

        //River
        this.river.setupLighting(
            std_light_position,
            std_ambient_color,
            std_diffuse_color
        );
        this.river.setIdentity();
        this.river.draw();

        //Land
        this.land.setupLighting(
            std_light_position,
            std_ambient_color,
            std_diffuse_color
        );
        this.land.setIdentity();
        this.land.translate(-this.side/2, 0, -this.side/2);
        this.land.draw();

        //Bridge
        this.bridge.setupLighting(
            std_light_position,
            std_ambient_color,
            std_diffuse_color,
            rust_reflectivity,
            full_shininess
        );
        this.bridge.setIdentity();
        this.bridge.draw();

        //Trees
        for (var i = 0; i < this.trees.length; i++){
            this.trees[i].setupLighting(
                std_light_position,
                std_ambient_color,
                std_diffuse_color,
                tree_reflectivity,
                no_shininess
            );
            this.trees[i].setIdentity();
            this.trees[i].translate(
                this.tree_positions[3*i],
                this.tree_positions[3*i+1],
                this.tree_positions[3*i+2]
            );
            this.trees[i].draw();
        }
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
