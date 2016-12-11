function River(data){
    NormalReflectGeometry.call(this);
    this.alpha = .9;
    this.side = data.side;

    this.latitude_bands = 1;
    this.longitude_bands = 1;

    this.material = {
        ambientReflectivity: vec3.fromValues(.5, .5, .5),
        diffuseReflectivity: vec3.fromValues(.5, .5, .5),
        specularReflectivity: vec3.fromValues(1, 1, 1),
        shininess: 16.0
    };

    this.initBuffers = function(){
        this.position_buffer = [];
        this.normal_buffer = [];
        this.tangent_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];
        this.texture_coord_buffer = [];

        var lat_number;
        var long_number;
        var lat_step = this.side/this.latitude_bands;
        var long_step = this.side/this.longitude_bands;

        for (lat_number = -this.side/2; lat_number <= this.side/2; lat_number += lat_step) {
            for (long_number = -this.side/2; long_number <= this.side/2; long_number += long_step) {
                this.normal_buffer.push(0);
                this.normal_buffer.push(1);
                this.normal_buffer.push(0);

                this.tangent_buffer.push(1);
                this.tangent_buffer.push(0);
                this.tangent_buffer.push(0);

                this.color_buffer.push(.1);
                this.color_buffer.push(.4);
                this.color_buffer.push(.4);

                this.position_buffer.push(long_number);
                this.position_buffer.push(0);
                this.position_buffer.push(lat_number);

                this.texture_coord_buffer.push(.5 + long_number/this.side);
                this.texture_coord_buffer.push(.5 + lat_number/this.side);
            }
        }

        for (lat_number = 0; lat_number < this.latitude_bands; lat_number++) {
            for (long_number = 0; long_number < this.longitude_bands; long_number++) {
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

    this.drawMode = function(){
        //
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        //gl.disable(gl.DEPTH_TEST);
        //

        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);

        //
        gl.disable(gl.BLEND);
        //gl.enable(gl.DEPTH_TEST);
        //
    };
}