function Land(data) {
    ColoredGeometry.call(this);

    this.latitude_bands = 218;
    this.longitude_bands = 250;

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
            lowest_point = data.river_curve.evaluate(lat_number/this.latitude_bands);

            for (long_number = 0; long_number <= this.longitude_bands; long_number++) {

                x = long_number*data.side/this.longitude_bands;
                y = data.ph1;
                z = lowest_point[2];

                if (Math.abs(x - lowest_point[0]) < data.river_width/2){
                    y = data.ph1
                        - Math.cos((Math.PI/2)*((x-lowest_point[0])/(data.river_width/2)))
                        *(data.ph1+data.ph3);

                    this.color_buffer.push(.3);
                    this.color_buffer.push(.15);
                    this.color_buffer.push(0);

                    var n = vec3.fromValues(x, y, z);
                    var center = vec3.fromValues(lowest_point[0], lowest_point[1], lowest_point[2]);
                    vec3.subtract(n, center, n);
                    vec3.normalize(n, n);

                    this.normal_buffer.push(n[0]);
                    this.normal_buffer.push(n[1]);
                    this.normal_buffer.push(n[2]);
                } else {
                    this.color_buffer.push(0);
                    this.color_buffer.push(.2);
                    this.color_buffer.push(0);

                    this.normal_buffer.push(0);
                    this.normal_buffer.push(1);
                    this.normal_buffer.push(0);
                }

                this.position_buffer.push(x);
                this.position_buffer.push(y);
                this.position_buffer.push(z);

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
        var lowest_point = data.river_curve.evaluate(z/data.side);
        return (Math.abs(x - lowest_point[0]) > data.river_width/2);
    };

    this.drawMode = function () {
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };
}