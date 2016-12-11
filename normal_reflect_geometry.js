function NormalReflectGeometry() {
    NMapGeometry.call(this);

    this.reflect_factor = .1; // Default
    this.alpha = .5;
    this.cube_map = null;

    this.shader = shaderProgramNormalReflectObject;

    this.initReflectionCube = function(cube){
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        var faces = [
            [cube.back, gl.TEXTURE_CUBE_MAP_POSITIVE_X],
            [cube.front, gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
            [cube.top, gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
            [cube.bottom, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
            [cube.right, gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
            [cube.left, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]
        ];

        for (var i = 0; i < faces.length; i++) {
            var face = faces[i][1];
            var image = new Image();
            image.onload = function(texture, face, image) {
                return function() {
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                    gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                }
            } (texture, face, image);
            image.src = faces[i][0];
        }
        this.cube_map = texture;
    };

    this.activateLighting = function(){
        gl.uniform3fv(this.shader.lightingDirectionUniform, this.light.position);

        gl.uniform3fv(this.shader.ambientIntensityUniform, this.light.ambient);
        gl.uniform3fv(this.shader.diffuseIntensityUniform, this.light.diffuse);
        gl.uniform3fv(this.shader.specularIntensityUniform, this.light.specular);

        gl.uniform3fv(this.shader.ambientReflectivityUniform, this.material.ambientReflectivity);
        gl.uniform3fv(this.shader.diffuseReflectivityUniform, this.material.diffuseReflectivity);
        gl.uniform3fv(this.shader.specularReflectivityUniform, this.material.specularReflectivity);
        gl.uniform1f(this.shader.shininessUniform, this.material.shininess);

        gl.uniform3fv(this.shader.worldCameraPositionUniform, camera.eye_point);
        gl.uniform1f(this.shader.reflectFactorUniform, this.reflect_factor);
        gl.uniform1f(this.shader.alphaUniform, this.alpha);
    };

    this.draw = function(){
        this.setupShaders();
        this.activateLighting();

        gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(this.shader.ViewMatrixUniform, false, camera_matrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(this.shader.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(this.shader.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(this.shader.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(this.shader.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_tangent_buffer);
        gl.vertexAttribPointer(this.shader.vertexTangentAttribute, this.webgl_tangent_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.shader.normalMapUniform, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cube_map);
        gl.uniform1i(this.shader.cubeMapUniform, 1);

        gl.uniformMatrix4fv(this.shader.ModelMatrixUniform, false, this.model_matrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, this.model_matrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(this.shader.nMatrixUniform, false, normalMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        this.drawMode();
    };
}