function LandPortion(data, i, j, size) {
    Geometry.call(this);

    this.latitude_bands = 64;
    this.longitude_bands = 64;

    this.start_i = i;
    this.start_j = j;

    this.shader = shaderProgramTerrain;

    this.material = {
        //Default values
        ambientReflectivity: vec3.fromValues(.7, .7, .7),
        diffuseReflectivity: vec3.fromValues(.8, .8, .8),
        specularReflectivity: vec3.fromValues(.5, .5, .5),
        shininess: 16.0
    };

    this.position_buffer = null;
    this.normal_buffer = null;
    this.tangent_buffer = null;
    this.texture_coord_buffer = null;
    this.index_buffer = null;
    this.is_land_buffer = null;
    this.is_rock_buffer = null;
    this.is_sand_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_tangent_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_index_buffer = null;
    this.webgl_is_land_buffer = null;
    this.webgl_is_rock_buffer = null;
    this.webgl_is_sand_buffer = null;

    // En los siguientes arrays la logica supone
    // que el orden es tierra, roca, arena.
    this.textures = [];
    this.normals = [];

    // MODELO
    this.initBuffers = function () {
        this.position_buffer = [];
        this.normal_buffer = [];
        this.tangent_buffer = [];
        this.texture_coord_buffer = []; // Definir u y v
        this.index_buffer = [];
        this.is_land_buffer = [];
        this.is_rock_buffer = [];
        this.is_sand_buffer = [];

        var lat_number = 0;
        var long_number = 0;

        var i_cut = i + size;
        var j_cut = j + size;

        var x0 = i - size/this.latitude_bands,
            y0 = data.ph1,
            z0 = j - size/this.longitude_bands;
        var x = i, y = data.ph1, z = j;

        var lowest_point;
        var u, v;

        for (j = this.start_j; j <= j_cut; j += size/this.latitude_bands) {
            lowest_point = data.river_curve.evaluate_by_z(j);
            for (i = this.start_i; i <= i_cut; i += size/this.longitude_bands) {

                x0 = x; y0 = y; z0 = z;

                x = i;
                y = data.ph1;
                z = j;

                // Logica de coordenadas u, v
                u = (i - this.start_i)/size;
                v = (j - this.start_j)/size;
                this.texture_coord_buffer.push(u);
                this.texture_coord_buffer.push(v);

                if (Math.abs(x - lowest_point[0]) < data.river_width/2){
                    // Logica para fondo del rio
                    x0 = i - size/this.latitude_bands;
                    y0 = data.ph1
                        - Math.cos((Math.PI/2)*((x0 -lowest_point[0])/(data.river_width/2)))
                        *(data.ph1+data.ph3);
                    z0 = j - size/this.longitude_bands;
                    y = data.ph1
                        - Math.cos((Math.PI/2)*((x-lowest_point[0])/(data.river_width/2)))
                        *(data.ph1+data.ph3);

                    var n = vec3.fromValues(x, y, z);
                    var center = vec3.fromValues(lowest_point[0], data.ph1+(data.ph3/2), lowest_point[2]);
                    vec3.subtract(n, center, n);
                    vec3.normalize(n, n);

                    this.normal_buffer.push(n[0]);
                    this.normal_buffer.push(n[1]);
                    this.normal_buffer.push(n[2]);

                    var t = vec3.fromValues(x - x0, y - y0, z - z0);
                    vec3.normalize(t, t);
                    this.tangent_buffer.push(t[0]);
                    this.tangent_buffer.push(t[1]);
                    this.tangent_buffer.push(t[2]);

                    var chance;
                    if (y < data.ph1/5){
                        this.is_land_buffer.push(0.0);
                        this.is_rock_buffer.push(0.0);
                        this.is_sand_buffer.push(1.0);
                    } else if (y < data.ph1/2.5) {
                        chance = 1.0-(y-(data.ph1/5))/(data.ph1/5);
                        this.is_land_buffer.push(0.0);
                        if (Math.random() < chance) {
                            this.is_sand_buffer.push(1.0);
                            this.is_rock_buffer.push(0.0);
                        } else {
                            this.is_sand_buffer.push(0.0);
                            this.is_rock_buffer.push(1.0);
                        }
                    } else if (y < (3*data.ph1)/5) {
                        this.is_land_buffer.push(0.0);
                        this.is_rock_buffer.push(1.0);
                        this.is_sand_buffer.push(0.0);
                    } else if (y < (4*data.ph1)/5) {
                        chance = 1.0-(y-(3*data.ph1/5))/(data.ph1/5);
                        this.is_sand_buffer.push(0.0);
                        if (Math.random() < chance) {
                            this.is_land_buffer.push(0.0);
                            this.is_rock_buffer.push(1.0);
                        } else {
                            this.is_land_buffer.push(1.0);
                            this.is_rock_buffer.push(0.0);
                        }
                    } else {
                        this.is_land_buffer.push(1.0);
                        this.is_rock_buffer.push(0.0);
                        this.is_sand_buffer.push(0.0);
                    }

                } else {
                    // Logica para terreno
                    this.normal_buffer.push(0);
                    this.normal_buffer.push(1);
                    this.normal_buffer.push(0);

                    this.tangent_buffer.push(1);
                    this.tangent_buffer.push(0);
                    this.tangent_buffer.push(0);

                    this.is_land_buffer.push(1.0);
                    this.is_rock_buffer.push(0);
                    this.is_sand_buffer.push(0);
                }

                this.position_buffer.push(x);
                this.position_buffer.push(y);
                this.position_buffer.push(z);

            }
        }

        for (lat_number = 0; lat_number < this.latitude_bands; lat_number++){
            for (long_number = 0; long_number < this.longitude_bands; long_number++){
                var first = (lat_number * (this.longitude_bands + 1)) + long_number;
                var second = first + this.longitude_bands + 1;
                this.index_buffer.push(first);
                this.index_buffer.push(second);
                this.index_buffer.push(first + 1);

                this.index_buffer.push(second);
                this.index_buffer.push(second + 1);
                this.index_buffer.push(first + 1);
            }
        }

        this.bufferize();
    };

    this.bufferize = function(){
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

        this.webgl_tangent_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangent_buffer), gl.STATIC_DRAW);
        this.webgl_tangent_buffer.itemSize = 3;
        this.webgl_tangent_buffer.numItems = this.tangent_buffer.length / 3;

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = this.position_buffer.length / 3;

        this.webgl_is_land_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_is_land_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.is_land_buffer), gl.STATIC_DRAW);
        this.webgl_is_land_buffer.itemSize = 1;
        this.webgl_is_land_buffer.numItems = this.webgl_is_land_buffer.length;

        this.webgl_is_rock_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_is_rock_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.is_rock_buffer), gl.STATIC_DRAW);
        this.webgl_is_rock_buffer.itemSize = 1;
        this.webgl_is_rock_buffer.numItems = this.webgl_is_rock_buffer.length;

        this.webgl_is_sand_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_is_sand_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.is_sand_buffer), gl.STATIC_DRAW);
        this.webgl_is_sand_buffer.itemSize = 1;
        this.webgl_is_sand_buffer.numItems = this.webgl_is_sand_buffer.length;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;
    };

    // TEXTURAS

    function handleLoadedTexture(tex) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, tex);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    this.initTexture = function(texture_file){
        var tex = gl.createTexture();
        tex.image = new Image();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([128, 128, 128, 255]));

        tex.image.onload = function () {
            handleLoadedTexture(tex)
        };
        tex.image.src = texture_file;
        this.textures.push(tex);
    };

    this.initNormalMap = function(texture_file){
        var normal_map = gl.createTexture();
        normal_map.image = new Image();
        normal_map.image = new Image();
        gl.bindTexture(gl.TEXTURE_2D, normal_map);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([128, 128, 128, 255]));


        normal_map.image.onload = function () {
            handleLoadedTexture(normal_map)
        };
        normal_map.image.src = texture_file;
        this.normals.push(normal_map);
    };

    // ILUMINACION

    this.activateLighting = function(){
        gl.uniform3fv(this.shader.lightingDirectionUniform, this.light.position);

        gl.uniform3fv(this.shader.ambientIntensityUniform, this.light.ambient);
        gl.uniform3fv(this.shader.diffuseIntensityUniform, this.light.diffuse);
        gl.uniform3fv(this.shader.specularIntensityUniform, this.light.specular);

        gl.uniform3fv(this.shader.ambientReflectivityUniform, this.material.ambientReflectivity);
        gl.uniform3fv(this.shader.diffuseReflectivityUniform, this.material.diffuseReflectivity);
        gl.uniform3fv(this.shader.specularReflectivityUniform, this.material.specularReflectivity);
        gl.uniform1f(this.shader.shininessUniform, this.material.shininess);
    };

    // DIBUJADO

    this.draw = function(){
        this.setupShaders();
        this.activateLighting();

        gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(this.shader.ViewMatrixUniform, false, camera_matrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(this.shader.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(this.shader.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(this.shader.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.vertexAttribPointer(this.shader.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_is_land_buffer);
        gl.vertexAttribPointer(this.shader.vertexIsLandAttribute, this.webgl_is_land_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_is_rock_buffer);
        gl.vertexAttribPointer(this.shader.vertexIsRockAttribute, this.webgl_is_rock_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_is_sand_buffer);
        gl.vertexAttribPointer(this.shader.vertexIsSandAttribute, this.webgl_is_sand_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
        gl.uniform1i(this.shader.earthColorUniform, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
        gl.uniform1i(this.shader.rockColorUniform, 1);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[2]);
        gl.uniform1i(this.shader.sandColorUniform, 2);

        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, this.normals[0]);
        gl.uniform1i(this.shader.earthNormalUniform, 3);

        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, this.normals[1]);
        gl.uniform1i(this.shader.rockNormalUniform, 4);

        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_2D, this.normals[2]);
        gl.uniform1i(this.shader.sandNormalUniform, 5);

        gl.uniformMatrix4fv(this.shader.ModelMatrixUniform, false, this.model_matrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, this.model_matrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(this.shader.nMatrixUniform, false, normalMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        this.drawMode();
    };

    this.drawMode = function () {
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };
}
