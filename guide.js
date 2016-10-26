function Guide(){
    ColoredGeometry.call(this);

    this.initBuffers = function(){
        this.position_buffer = [
            -150, 5, 0,
            150, 5, 0
        ];
        this.normal_buffer = [
            0, 1, 0,
            0, 1, 0
        ];
        this.color_buffer = [];
        this.index_buffer = [0, 1];
        for (var i = 0; i < this.position_buffer.length/3; i++){
            this.color_buffer.push(1.0);
            this.color_buffer.push(0);
            this.color_buffer.push(0);
        }

        this.bufferize();
    };

    this.drawMode = function(){
        gl.drawElements(gl.LINES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };
}