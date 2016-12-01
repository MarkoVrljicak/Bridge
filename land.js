function Land(data){
    // Esta clase existe solamente para bypassear
    // el limite de webgl de indices de 16 bits
    this.portions = [];
    var chunk_size = 50;

    for (var i = 0; i < data.side; i += chunk_size){
        for (var j = 0; j < data.side; j += chunk_size){
            var new_land = new LandPortion(data, i, j, chunk_size);
            new_land.initBuffers();
            new_land.initTexture(textures.land.earth.color);
            new_land.initTexture(textures.land.rock.color);
            new_land.initTexture(textures.land.sand.color);
            new_land.initNormalMap(textures.land.earth.normal);
            new_land.initNormalMap(textures.land.rock.normal);
            new_land.initNormalMap(textures.land.sand.normal);
            this.portions.push(new_land);
        }
    }

    this.setupLighting = function(light){
        for (var i = 0; i < this.portions.length; i++){
            this.portions[i].setupLighting(light);
        }
    };

    this.setIdentity = function(){
        for (var i = 0; i < this.portions.length; i++){
            this.portions[i].setIdentity();
        }
    };

    this.translate = function(x, y, z){
        for (var i = 0; i < this.portions.length; i++){
            this.portions[i].translate(x, y, z);
        }
    };

    this.draw = function(){
        for (var i = 0; i < this.portions.length; i++){
            this.portions[i].draw();
        }
    };

    this.on_land = function(x, z){
        var lowest_point = data.river_curve.evaluate_by_z(z);
        return (Math.abs(x - lowest_point[0]) > data.river_width/2);
    };

}