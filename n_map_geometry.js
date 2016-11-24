function NMapGeometry(){
    Geometry.call(this);

    this.material = {
        //Default values
        ambientReflectivity: vec3.fromValues(.5, .5, .5),
        diffuseReflectivity: vec3.fromValues(.5, .5, .5),
        specularReflectivity: vec3.fromValues(.5, .5, .5),
        shininess: 1.0
    };

    this.model_matrix = mat4.create();

    this.position_buffer = null;
    this.normal_buffer = null;
    this.tangent_buffer = null;
    this.texture_coord_buffer = null;
    this.index_buffer = null;
    this.color_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_tangent_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;

    this.texture = null;

    function handleLoadedTexture(model) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, model.texture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, model.texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    this.initTexture = function(texture_file){
        this.texture = gl.createTexture();
        this.texture.image = new Image();

        var model = this;

        this.texture.image.onload = function () {
            handleLoadedTexture(model)
        };
        this.texture.image.src = texture_file;
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

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.webgl_color_buffer.length / 3;

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

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;
    };

    this.setupShaders = function(){
        gl.useProgram(shaderProgramNMapObject);
    };

    this.setupLighting = function(light){
        this.setupShaders();

        gl.uniform3fv(shaderProgramNMapObject.lightingDirectionUniform, light.position);

        gl.uniform3fv(shaderProgramNMapObject.ambientIntensityUniform, light.ambient);
        gl.uniform3fv(shaderProgramNMapObject.diffuseIntensityUniform, light.diffuse);
        gl.uniform3fv(shaderProgramNMapObject.specularIntensityUniform, light.specular);

        gl.uniform3fv(shaderProgramNMapObject.ambientReflectivityUniform, this.material.ambientReflectivity);
        gl.uniform3fv(shaderProgramNMapObject.diffuseReflectivityUniform, this.material.diffuseReflectivity);
        gl.uniform3fv(shaderProgramNMapObject.specularReflectivityUniform, this.material.specularReflectivity);
        gl.uniform1f(shaderProgramNMapObject.shininessUniform, this.material.shininess);
    };

    this.draw = function(){
        this.setupShaders();

        gl.uniformMatrix4fv(shaderProgramNMapObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramNMapObject.ViewMatrixUniform, false, camera_matrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramNMapObject.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(shaderProgramNMapObject.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(shaderProgramNMapObject.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramNMapObject.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.vertexAttribPointer(shaderProgramNMapObject.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shaderProgramNMapObject.normalMapUniform, 0);

        gl.uniformMatrix4fv(shaderProgramNMapObject.ModelMatrixUniform, false, this.model_matrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, this.model_matrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramNMapObject.nMatrixUniform, false, normalMatrix);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        this.drawMode();
    };
}