function HTransition(){
    ColoredGeometry.call(this);

    this.initBuffers = function(){
        this.position_buffer = [
            -1.5, 1.5, -1.5,
            -1.5, 0, -1.5,
            1.5, 1.5, -1.5,
            1.5, 0, -1.5,
            1.5, 1.5, -.5,
            1.5, 0, -.5,
            .5, 1.5, -.5,
            .5, 0, -.5,
            .5, 1.5, .5,
            .5, 0, .5,
            1.5, 1.5, .5,
            1.5, 0, .5,
            1.5, 1.5, 1.5,
            1.5, 0, 1.5,
            -1.5, 1.5, 1.5,
            -1.5, 0, 1.5,
            -1.5, 1.5, .5,
            -1.5, 0, .5,
            -.5, 1.5, .5,
            -.5, 0, .5,
            -.5, 1.5, -.5,
            -.5, 0, -.5,
            -1.5, 1.5, -.5,
            -1.5, 0, -.5,
            -1.5, 1.5, -1.5,
            -1.5, 0, -1.5 //26 vertices
        ];
        this.normal_buffer = [
            -.6, .6, -.6,
            -.6, .6, -.6,
            .6, .6, -.6,
            .6, .6, -.6,
            .6, .6, .6,
            .6, .6, .6,
            -.6, .6, .6,
            -.6, .6, .6,
            -.6, .6, -.6,
            -.6, .6, -.6,
            .6, .6, -.6,
            .6, .6, -.6,
            .6, .6, .6,
            .6, .6, .6,
            -.6, .6, .6,
            -.6, .6, .6,
            -.6, .6, -.6,
            -.6, .6, -.6,
            .6, .6, -.6,
            .6, .6, -.6,
            .6, .6, .6,
            .6, .6, .6,
            -.6, .6, .6,
            -.6, .6, .6,
            -.6, .6, -.6,
            -.6, .6, -.6 //26 vertices
        ];
        this.color_buffer = [];
        this.index_buffer = [];
        for (var i = 0; i < this.position_buffer.length/3; i++){
            this.color_buffer.push(1.0);
            this.color_buffer.push(0);
            this.color_buffer.push(0);

            this.index_buffer.push(i);
        }

        this.bufferize();
    };

    this.drawMode = function(){
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };

}