function HSection(){
    ColoredGeometry.call(this);

    this.initBuffers = function(){
        this.position_buffer = [
            0, 3, 0,
            0, 0, 0,
            3, 3, 0,
            3, 0, 0,
            3, 3, 1,
            3, 0, 1,
            2, 3, 1,
            2, 0, 1,
            2, 3, 2,
            2, 0, 2,
            3, 3, 2,
            3, 0, 2,
            3, 3, 3,
            3, 0, 3,
            0, 3, 3,
            0, 0, 3,
            0, 3, 2,
            0, 0, 2,
            1, 3, 2,
            1, 0, 2,
            1, 3, 1,
            1, 0, 1,
            0, 3, 1,
            0, 0, 1,
            0, 3, 0,
            0, 0, 0 //26 vertices
        ];
        this.normal_buffer = this.position_buffer;
        this.color_buffer = [];
        for (var i = 0; i < this.position_buffer.length; i++){
            this.color_buffer.push(1.0);
            this.color_buffer.push(0);
            this.color_buffer.push(0);
        }
        this.index_buffer = [];
        for (i = 0; i < 26; i++){
            this.index_buffer.push(i);
        }
        this.bufferize();
    };

    this.drawMode = function(){
        gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };

}