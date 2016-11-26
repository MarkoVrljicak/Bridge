function ColoredGeometry(){
    Geometry.call(this);

    this.position_buffer = null;
    this.normal_buffer = null;
    this.color_buffer = null;
    this.index_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_color_buffer = null;
    this.webgl_index_buffer = null;

    this.shader = shaderProgramColoredObject;

    this.bufferize = function(){
        // Creación e Inicialización de los buffers a nivel de OpenGL
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);
        this.webgl_color_buffer.itemSize = 3;
        this.webgl_color_buffer.numItems = this.webgl_color_buffer.length / 3;

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

    this.setupLighting = function(light){
        // Configuración de la luz
        // Se inicializan las variables asociadas con la Iluminación
        this.setupShaders();
        gl.uniform1i(this.shader.useLightingUniform, true);

        gl.uniform3fv(this.shader.lightingDirectionUniform, light.position);
        gl.uniform3fv(this.shader.ambientColorUniform, light.ambient );
        gl.uniform3fv(this.shader.directionalColorUniform, light.diffuse);
    };

    this.draw = function(){
        this.setupShaders();

        gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(this.shader.ViewMatrixUniform, false, camera_matrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(this.shader.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(this.shader.vertexColorAttribute, this.webgl_color_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(this.shader.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(this.shader.ModelMatrixUniform, false, this.model_matrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, this.model_matrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(this.shader.nMatrixUniform, false, normalMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        this.drawMode();
    };

    this.setUniformColor = function(r, g, b){
        for (var i= 0; i < this.color_buffer.length; ++i){
            var rgb_mag;
            switch(i%3){
                case 0:
                    rgb_mag = r;
                    break;
                case 1:
                    rgb_mag = g;
                    break;
                case 2:
                    rgb_mag = b;
                    break;
            }
            this.color_buffer[i] = rgb_mag;
        }
        this.bufferize();
    }
}

