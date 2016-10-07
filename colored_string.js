function ColoredString(curve, n_curve_evaluations, longitude_bands){
    ColoredGeometry.call(this);

    this.curve = curve;
    this.n_curve_evaluations = n_curve_evaluations;
    this.longitude_bands = longitude_bands;

    this.initBuffers = function(){
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];

        var eval;
        var longNumber;
        var curve_img;

        for (eval=0; eval <= this.n_curve_evaluations; eval++) {
            curve_img = this.curve.evaluate(eval/n_curve_evaluations);

            for (longNumber=0; longNumber <= this.longitude_bands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / this.longitude_bands;

                var x = curve_img[0];
                var y = curve_img[1] + Math.cos(phi) * .5;
                var z = curve_img[2] + Math.sin(phi) * .5;
                console.log(x, y, z);
                var u = 1.0 - (longNumber / this.longitude_bands);
                var v = 1.0 - (eval / this.n_curve_evaluations);

                this.normal_buffer.push(0);
                this.normal_buffer.push(y);
                this.normal_buffer.push(z);

                // Mejorar o modificar el algoritmo que inicializa
                // el color de cada vertice
                this.color_buffer.push(.5);
                this.color_buffer.push(.5);
                this.color_buffer.push(.5);

                this.position_buffer.push(x);
                this.position_buffer.push(y);
                this.position_buffer.push(z);

                // Indices de los triangulos
                if (eval != this.n_curve_evaluations && longNumber != this.longitude_bands) {
                    var first = (eval * (this.longitudeBands + 1)) + longNumber;
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
