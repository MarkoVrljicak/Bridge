function ColoredString(curve, n_curve_evaluations, longitude_bands){
    ColoredGeometry.call(this);

    this.curve = curve;
    console.log(this.curve.get_points());
    this.curve_len = Math.abs(this.curve.evaluate(1)[0] - this.curve.evaluate(0)[0]);
    this.start = this.curve.evaluate(0)[0];
    this.n_curve_evaluations = n_curve_evaluations;
    this.longitude_bands = longitude_bands;

    this.initBuffers = function(){
        console.log("Generating string...");
        //console.log("start",this.curve.evaluate(0)[0]);
        //console.log("middle", this.curve.evaluate(.38)[0]);
        //console.log("end", this.curve.evaluate(1)[0]);

        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];

        var eval;
        var longitude;
        var curve_img;

        for (eval=0; eval <= this.n_curve_evaluations; eval++) {
            //console.log("eval:", this.start + (this.curve_len*eval/n_curve_evaluations));
            curve_img = this.curve.evaluate_by_x(this.start + (this.curve_len*eval/n_curve_evaluations));
            //console.log("img:", curve_img);

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
        console.log("done");
    };

    this.drawMode = function() {
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}
