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
        var point;
        var phi = 2 * Math.PI / this.rotation_points;

        for (eval=0; eval <= this.curve_eval; eval++) {
            curve_img = this.curve.evaluate(eval/curve_eval);
            point = vec3.fromValues(curve_img[0], curve_img[1], 0);
            for (longitude=0; longitude <= this.rotation_points; longitude++) {
                vec3.rotateY(point, point, vec3.fromValues(0,0,0), phi);

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

        // Calcula la normal de cada punto mediante el producto vectorial de
        // (1) el vector que va del punto adyacente superior al inferior y
        // (2) el vector que va del punto adyacente izquierdo al derecho
        // TODO: DEBUG
        var below_point;
        var upper_point;
        var previous_point;
        var next_point;
        var offset;
        var normal = vec3.create();
        var horizontal_vector = vec3.create();
        var vertical_vector = vec3.create();
        for (eval = 0; eval <= this.curve_eval; eval++) {
            for (longitude = 0; longitude <= this.rotation_points; longitude++) {
                if (eval == 0){
                    this.normal_buffer.push(0);
                    this.normal_buffer.push(-1);
                    this.normal_buffer.push(0);
                } else if (eval == this.curve_eval) {
                    this.normal_buffer.push(0);
                    this.normal_buffer.push(1);
                    this.normal_buffer.push(0);
                } else {
                    if (!longitude) {
                        offset = 3*((this.rotation_points+1)*(longitude+1));
                    } else {
                        offset = 3*((this.rotation_points+1)*longitude + eval + 1);
                    }
                    previous_point = vec3.fromValues(
                        this.position_buffer[offset],
                        this.position_buffer[offset + 1],
                        this.position_buffer[offset + 2]
                    );
                    if (longitude == this.rotation_points) {
                        offset = 3*((this.rotation_points+1)*longitude+1);
                    } else {
                        offset = 3*((this.rotation_points+1)*longitude + eval - 1);
                    }
                    next_point = vec3.fromValues(
                        this.position_buffer[offset],
                        this.position_buffer[offset + 1],
                        this.position_buffer[offset + 2]
                    );
                    offset = 3*(this.rotation_points*(longitude-1)+eval);
                    below_point = vec3.fromValues(
                        this.position_buffer[offset],
                        this.position_buffer[offset + 1],
                        this.position_buffer[offset + 2]
                    );
                    offset = 3*(this.rotation_points*(longitude+1)+eval);
                    upper_point = vec3.fromValues(
                        this.position_buffer[offset],
                        this.position_buffer[offset + 1],
                        this.position_buffer[offset + 2]
                    );
                    vec3.subtract(vertical_vector, upper_point, below_point);
                    vec3.subtract(horizontal_vector, previous_point, next_point);
                    vec3.cross(normal, vertical_vector, horizontal_vector);
                    vec3.normalize(normal, normal);
                    this.normal_buffer.push(normal[0]);
                    this.normal_buffer.push(normal[1]);
                    this.normal_buffer.push(normal[2]);
                }
            }
        }
        this.bufferize();
    };

    this.drawMode = function() {
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}