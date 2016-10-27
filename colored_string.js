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
        var longitude;
        var curve_img;

        for (eval=0; eval <= this.n_curve_evaluations; eval++) {
            curve_img = this.curve.evaluate(eval/n_curve_evaluations);

            for (longitude=0; longitude <= this.longitude_bands; longitude++) {
                var phi = longitude * 2 * Math.PI / this.longitude_bands;

                var x = curve_img[0];
                var y = curve_img[1] + Math.cos(phi) * .25;
                var z = curve_img[2] + Math.sin(phi) * .25;

                this.normal_buffer.push(0);
                this.normal_buffer.push(Math.cos(phi) * .5);
                this.normal_buffer.push(Math.sin(phi) * .5);

                this.color_buffer.push(.4);
                this.color_buffer.push(0);
                this.color_buffer.push(0);

                this.position_buffer.push(x);
                this.position_buffer.push(y);
                this.position_buffer.push(z);

                if (eval != this.n_curve_evaluations && longitude != this.longitude_bands) {
                    var first = (eval * (this.longitude_bands + 1)) + longitude;
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
