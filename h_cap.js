function HCap(){
    ColoredGeometry.call(this);

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
        this.color_buffer = [];
        this.index_buffer = [
            0, 1, 2, 0, 2, 11, 10, 3, 4, 9, 10, 4, 8, 5, 6, 7, 8, 6
        ];
        for (var i = 0; i < this.position_buffer.length/3; i++){
            this.normal_buffer.push(0);
            this.normal_buffer.push(1);
            this.normal_buffer.push(0);

            this.color_buffer.push(1.0);
            this.color_buffer.push(0);
            this.color_buffer.push(0);

        }

        this.bufferize();
    };

    this.drawMode = function(){
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };
}