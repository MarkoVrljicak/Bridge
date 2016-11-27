function HCap(){
    NormalTexturedGeometry.call(this);

    this.initBuffers = function(){
        this.position_buffer = [
            -1.5, 0, -1.5,
            1.5, 0, -1.5,
            1.5, 0, -.5,
            .5, 0, -.5,
            .5, 0, .5,
            1.5, 0, .5,
            1.5, 0, 1.5,
            -1.5, 0, 1.5,
            -1.5, 0, .5,
            -.5, 0, .5,
            -.5, 0, -.5,
            -1.5, 0, -.5
        ];
        this.normal_buffer = [];
        this.tangent_buffer = [];
        this.texture_coord_buffer = [
            0, 0,
            1, 0,
            1, .33,
            .66, .33,
            .66, .66,
            1, .66,
            1, 1,
            0, 1,
            0, .66,
            .33, .66,
            .33, .33,
            0, .33
        ];
        this.index_buffer = [
            0, 1, 2, 0, 2, 11, 10, 3, 4, 9, 10, 4, 8, 5, 6, 7, 8, 6
        ];
        for (var i = 0; i < this.position_buffer.length/3; i++){
            this.normal_buffer.push(0);
            this.normal_buffer.push(1);
            this.normal_buffer.push(0);

            this.tangent_buffer.push(1);
            this.tangent_buffer.push(0);
            this.tangent_buffer.push(0);
        }

        this.bufferize();
    };

    this.drawMode = function(){
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };
}