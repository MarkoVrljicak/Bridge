function ColoredCylinder(latitude_bands, longitude_bands){
    ColoredGeometry.call(this);

    this.latitude_bands = latitude_bands;
    this.longitude_bands = longitude_bands;

    this.initBuffers = function(){
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];

        var lat_number;
        var long_number;

        for (lat_number=0; lat_number <= this.latitude_bands; lat_number++) {
            var h = 1.0/lat_number;

            for (long_number=0; long_number <= this.longitude_bands; long_number++) {
                var phi = long_number * 2 * Math.PI / this.longitude_bands;

                var x = Math.cos(phi) * .5;
                var y = h;
                var z = Math.sin(phi) * .5;

                this.normal_buffer.push(2*x);
                this.normal_buffer.push(0);
                this.normal_buffer.push(2*z);

                // Mejorar o modificar el algoritmo que inicializa
                // el color de cada vertice
                this.color_buffer.push(.37);
                this.color_buffer.push(.24);
                this.color_buffer.push(.03);

                this.position_buffer.push(x);
                this.position_buffer.push(y);
                this.position_buffer.push(z);

                // Indices de los triangulos
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

    this.drawMode = function() {
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }


}