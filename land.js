function Land(latitude_bands, longitude_bands, side_len, ground_height, river_curve, river_width) {
    ColoredGeometry.call(this);

    this.latitude_bands = latitude_bands;
    this.longitude_bands = longitude_bands;
    this.side_len = side_len;
    this.ground_height = ground_height;
    this.river_curve = river_curve;
    this.river_width = river_width;

    this.initBuffers = function () {
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];

        var lat_number;
        var long_number;

        var x, y, z;
        var lowest_point;

        for (lat_number = 0; lat_number <= this.latitude_bands; lat_number++) {
            lowest_point = this.river_curve.evaluate(lat_number/this.latitude_bands);

            for (long_number = 0; long_number <= this.longitude_bands; long_number++) {

                x = long_number*this.side_len/this.longitude_bands;
                y = ground_height;
                z = lowest_point[2];

                if (Math.abs(x - lowest_point[0]) < this.river_width/2){
                    y = -1;
                    this.color_buffer.push(.3);
                    this.color_buffer.push(.4);
                    this.color_buffer.push(0);
                } else {
                    this.color_buffer.push(0);
                    this.color_buffer.push(.4);
                    this.color_buffer.push(0);
                }

                this.position_buffer.push(x);
                this.position_buffer.push(y);
                this.position_buffer.push(z);

                this.normal_buffer.push(0);
                this.normal_buffer.push(1);
                this.normal_buffer.push(0);

                if (lat_number != this.latitude_bands && long_number != this.longitude_bands) {
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
        }
        this.bufferize();
    };

    this.on_land = function(x, z){
        var lowest_point = this.river_curve.evaluate(z/this.side_len);
        return (Math.abs(x - lowest_point[0]) > this.river_width/2);
    };

    this.drawMode = function () {
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };
}