function ColoredSphere(latitude_bands, longitude_bands){
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
            var theta = latNumber * Math.PI / this.latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (longNumber=0; longNumber <= this.longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / this.longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;

                this.normal_buffer.push(x);
                this.normal_buffer.push(y);
                this.normal_buffer.push(z);

                // Mejorar o modificar el algoritmo que inicializa
                // el color de cada vertice
                this.color_buffer.push(.3);
                this.color_buffer.push(1);
                this.color_buffer.push(.8);

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

    this.drawMode = function(){
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    };

}