function Land(data) {
    Geometry.call(this);

    this.latitude_bands = 300;
    this.longitude_bands = 300;

    this.shader = shaderProgramTerrain;

    this.position_buffer = null;
    this.normal_buffer = null;
    this.tangent_buffer = null;
    this.texture_coord_buffer = null;
    this.index_buffer = null;
    this.is_land_buffer = null;
    this.is_rock_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_tangent_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_index_buffer = null;
    this.webgl_is_land_buffer = null;
    this.webgl_is_rock_buffer = null;

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

        var lat_number;
        var long_number;

        var x0 = 0, y0 = 0, z0 = 0;
        var x = 0, y = 0, z = 0;
        var lowest_point;

        var u, v;

        for (lat_number = 0; lat_number <= this.latitude_bands; lat_number++) {
            lowest_point = data.river_curve.evaluate_by_z(lat_number*data.side/this.latitude_bands);

            for (long_number = 0; long_number <= this.longitude_bands; long_number++) {

                x0 = x; y0 = y; z0 = z;

                x = long_number*data.side/this.longitude_bands;
                y = data.ph1;
                z = lowest_point[2];

                // Logica de coordenadas u, v
                //u = (x % 5) / 5;
                //v = (z % 5) / 5;
                u = long_number/this.longitude_bands;
                v = lat_number/this.latitude_bands;
                this.texture_coord_buffer.push(u);
                this.texture_coord_buffer.push(v);

                if (Math.abs(x - lowest_point[0]) < data.river_width/2){
                    // Logica para fondo del rio

                    y = data.ph1
                        - Math.cos((Math.PI/2)*((x-lowest_point[0])/(data.river_width/2)))
                        *(data.ph1+data.ph3);

                    var n = vec3.fromValues(x, y, z);
                    var center = vec3.fromValues(lowest_point[0], lowest_point[1], lowest_point[2]);
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

                    this.is_land_buffer.push(0);
                    if (y < data.ph1/2) this.is_rock_buffer.push(0);
                    else this.is_rock_buffer.push(1.0);

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
                }

                this.position_buffer.push(x);
                this.position_buffer.push(y);
                this.position_buffer.push(z);
            }
        }

        var row, col;
        for (row = 0; row < this.latitude_bands; row++) {
            if (row % 2) {
                for (col = 0; col < this.longitude_bands; col++){
                    this.index_buffer.push(col + row * (this.longitude_bands + 1));
                    this.index_buffer.push(col + (row + 1) * (this.longitude_bands + 1));
                }
            } else {
                for (col = this.longitude_bands; col > 0; col--){
                    this.index_buffer.push(col + (row+1) * (this.longitude_bands + 1));
                    this.index_buffer.push(col - 1 + row * (this.longitude_bands + 1));
                }
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

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    this.initTexture = function(texture_file){
        var tex = gl.createTexture();
        tex.image = new Image();

        tex.image.onload = function () {
            handleLoadedTexture(tex)
        };
        tex.image.src = texture_file;
        this.textures.push(tex);
    };

    this.initNormalMap = function(texture_file){
        var normal_map = gl.createTexture();
        normal_map.image = new Image();

        normal_map.image.onload = function () {
            handleLoadedTexture(normal_map)
        };
        normal_map.image.src = texture_file;
        this.normals.push(normal_map);
    };

    // ILUMINACION

    this.setupLighting = function(light){
        this.setupShaders();

        gl.uniform3fv(this.shader.lightingDirectionUniform, light.position);

        gl.uniform3fv(this.shader.ambientIntensityUniform, light.ambient);
        gl.uniform3fv(this.shader.diffuseIntensityUniform, light.diffuse);
        gl.uniform3fv(this.shader.specularIntensityUniform, light.specular);

        gl.uniform3fv(this.shader.ambientReflectivityUniform, this.material.ambientReflectivity);
        gl.uniform3fv(this.shader.diffuseReflectivityUniform, this.material.diffuseReflectivity);
        gl.uniform3fv(this.shader.specularReflectivityUniform, this.material.specularReflectivity);
        gl.uniform1f(this.shader.shininessUniform, this.material.shininess);
    };

    // LOGICA EXTRA

    this.on_land = function(x, z){
        var lowest_point = data.river_curve.evaluate_by_z(z);
        return (Math.abs(x - lowest_point[0]) > data.river_width/2);
    };

    // DIBUJADO

    this.draw = function(){
        this.setupShaders();

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

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
        gl.uniform1i(this.shader.earthColorUniform, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
        gl.uniform1i(this.shader.rockColorUniform, 1);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[2]);
        gl.uniform1i(this.shader.sandColorUniform, 2);

        //gl.activeTexture(gl.TEXTURE3);
        //gl.bindTexture(gl.TEXTURE_2D, this.normals[0]);
        //gl.uniform1i(this.shader.earthNormalUniform, 3);

        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, this.normals[1]);
        gl.uniform1i(this.shader.rockNormalUniform, 4);

        //gl.activeTexture(gl.TEXTURE5);
        //gl.bindTexture(gl.TEXTURE_2D, this.normals[2]);
        //gl.uniform1i(this.shader.sandNormalUniform, 5);

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
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };
}