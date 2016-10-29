function River(data){
    ColoredGeometry.call(this);
    this.side = data.side;

    this.latitude_bands = 150;
    this.longitude_bands = 150;

    this.initBuffers = function(){
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];

        var lat_number;
        var long_number;
        var lat_step = this.side/this.latitude_bands;
        var long_step = this.side/this.longitude_bands;

        for (lat_number = -this.side/2; lat_number <= this.side/2; lat_number += lat_step) {
            for (long_number = -this.side/2; long_number <= this.side/2; long_number += long_step) {
                this.normal_buffer.push(0);
                this.normal_buffer.push(1);
                this.normal_buffer.push(0);

                this.color_buffer.push(0);
                this.color_buffer.push(0);
                this.color_buffer.push(.3);

                this.position_buffer.push(long_number);
                this.position_buffer.push(0);
                this.position_buffer.push(lat_number);
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
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };
}