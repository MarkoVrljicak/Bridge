function Wire(curve, n_curve_evaluations, longitude_bands){
    NormalReflectGeometry.call(this);

    this.reflect_factor = .01;

    this.curve = curve;
    this.curve_len = Math.abs(this.curve.evaluate(1)[0] - this.curve.evaluate(0)[0]);
    this.start = this.curve.evaluate(0)[0];
    this.n_curve_evaluations = n_curve_evaluations;
    this.longitude_bands = longitude_bands;

    this.initBuffers = function(){
        this.position_buffer = [];
        this.normal_buffer = [];
        this.texture_coord_buffer = [];
        this.index_buffer = [];

        this.tangent_buffer = [];
        this.color_buffer = [];

        var eval;
        var longitude;
        var curve_img;

        for (eval=0; eval <= this.n_curve_evaluations; eval++) {
            curve_img = this.curve.evaluate_by_x(this.start + (this.curve_len*eval/n_curve_evaluations));

            for (longitude=0; longitude <= this.longitude_bands; longitude++) {
                var phi = longitude * 2 * Math.PI / this.longitude_bands;

                var x = curve_img[0];
                var y = curve_img[1] + Math.cos(phi) * .25;
                var z = curve_img[2] + Math.sin(phi) * .25;
                var u = 1.0 - (longitude / this.longitude_bands);
                var v = 1.0 - (eval / this.latitude_bands);

                this.normal_buffer.push(0);
                this.normal_buffer.push(Math.cos(phi) * .5);
                this.normal_buffer.push(Math.sin(phi) * .5);

                this.tangent_buffer.push(1);
                this.tangent_buffer.push(0);
                this.tangent_buffer.push(0);

                this.color_buffer.push(.3);
                this.color_buffer.push(.2);
                this.color_buffer.push(.1);

                this.texture_coord_buffer.push(v);
                this.texture_coord_buffer.push(u);

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
