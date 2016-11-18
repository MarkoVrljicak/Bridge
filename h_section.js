function HSection(){
    TexturedGeometry.call(this);

    this.initBuffers = function(){
        this.position_buffer = [
            -1.5, 3, -1.5,
            -1.5, 0, -1.5,
            1.5, 3, -1.5,
            1.5, 0, -1.5,
            1.5, 3, -.5,
            1.5, 0, -.5,
            .5, 3, -.5,
            .5, 0, -.5,
            .5, 3, .5,
            .5, 0, .5,
            1.5, 3, .5,
            1.5, 0, .5,
            1.5, 3, 1.5,
            1.5, 0, 1.5,
            -1.5, 3, 1.5,
            -1.5, 0, 1.5,
            -1.5, 3, .5,
            -1.5, 0, .5,
            -.5, 3, .5,
            -.5, 0, .5,
            -.5, 3, -.5,
            -.5, 0, -.5,
            -1.5, 3, -.5,
            -1.5, 0, -.5,
            -1.5, 3, -1.5,
            -1.5, 0, -1.5 //26 vertices
        ];
        this.normal_buffer = [
            -.7, 0, -.7,
            -.7, 0, -.7,
            .7, 0, -.7,
            .7, 0, -.7,
            .7, 0, .7,
            .7, 0, .7,
            -.7, 0, .7,
            -.7, 0, .7,
            -.7, 0, -.7,
            -.7, 0, -.7,
            .7, 0, -.7,
            .7, 0, -.7,
            .7, 0, .7,
            .7, 0, .7,
            -.7, 0, .7,
            -.7, 0, .7,
            -.7, 0, -.7,
            -.7, 0, -.7,
            .7, 0, -.7,
            .7, 0, -.7,
            .7, 0, .7,
            .7, 0, .7,
            -.7, 0, .7,
            -.7, 0, .7,
            -.7, 0, -.7,
            -.7, 0, -.7 //26 vertices
        ];
        this.texture_coord_buffer = [
            0, 1,
            0, 0,
            1, 1,
            1, 0,
            0, 1,
            0, 0,
            1, 1,
            1, 0,
            0, 1,
            0, 0,
            1, 1,
            1, 0,
            0, 1,
            0, 0,
            1, 1,
            1, 0,
            0, 1,
            0, 0,
            1, 1,
            1, 0,
            0, 1,
            0, 0,
            1, 1,
            1, 0,
            0, 1,
            0, 0
        ];
        this.index_buffer = [];
        for (var i = 0; i < this.position_buffer.length/3; i++){
            this.index_buffer.push(i);
        }

        this.bufferize();
    };

    this.drawMode = function(){
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };

}