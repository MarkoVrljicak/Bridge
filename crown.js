function Crown(curve, curve_eval, rotation_points){
    /**
     * Generates crown of a tree
     * @param {Curve} curve: for revolution surface. Z value will be ignored if present.
     * @param {Number} curve_eval: number of evaluations on the curve
     * @param {Number} rotation_points: Number of times the curve is rotated to generate a surface
     */
    ColoredGeometry.call(this);

    this.curve = curve;
    this.curve_eval = curve_eval;
    this.rotation_points = rotation_points;

    this.initBuffers = function(){
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];

        var eval;
        var longitude;
        var curve_img;

        for (eval=0; eval <= this.curve_eval; eval++) {
            curve_img = this.curve.evaluate(eval/curve_eval);
            var point = vec3.fromValues(curve_img[0], curve_img[1], 0);
            console.log(point);

            for (longitude=0; longitude <= this.rotation_points; longitude++) {
                var phi = longitude * 2 * Math.PI / this.rotation_points;

                vec3.rotateY(point, point, vec3.fromValues(0,0,0), phi);

                this.normal_buffer.push(.7); // TODO: Este calculo
                this.normal_buffer.push(.7);
                this.normal_buffer.push(.7);

                this.color_buffer.push(0);
                this.color_buffer.push(.3);
                this.color_buffer.push(0);

                this.position_buffer.push(point[0]);
                this.position_buffer.push(point[1]);
                this.position_buffer.push(point[2]);

                if (eval != this.curve_eval && longitude != this.rotation_points) {
                    var first = (eval * (this.rotation_points + 1)) + longitude;
                    var second = first + this.rotation_points + 1;
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