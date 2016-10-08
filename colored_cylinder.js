function ColoredCylinder(latitude_bands, longitude_bands){
    ColoredGeometry.call(this);

    this.latitudeBands = latitude_bands;
    this.longitudeBands = longitude_bands;

    this.initBuffers = function(){
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];

        var latNumber;
        var longNumber;

        for (latNumber=0; latNumber <= this.latitudeBands; latNumber++) {
            var h = 1.0/latNumber;

            for (longNumber=0; longNumber <= this.longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / this.longitudeBands;

                var x = Math.cos(phi) * .5;
                var y = h;
                var z = Math.sin(phi) * .5;
                var u = 1.0 - (longNumber / this.longitudeBands);
                var v = 1.0 - (latNumber / this.latitudeBands);

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
                if (latNumber != this.latitudeBands && longNumber != this.longitudeBands) {
                    var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
                    var second = first + this.longitudeBands + 1;
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