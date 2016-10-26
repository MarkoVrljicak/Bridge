function Road(map_side, n_sections, ground_height){
    ColoredGeometry.call(this);

    this.length = map_side;
    this.n_sections = n_sections;
    this.ground_height = ground_height;
    this.section = [
        0, -.5, -7.5,
        0, -.5, 7.5,
        0, 1, 7.5,
        0, 1, 6.5,
        0, 1, 6.5,
        0, .5, 6.5,
        0, .5, -6.5,
        0, 1, -6.5,
        0, 1, -6.5,
        0, 1, -7.5,
        0, -.5, -7.5
    ];

    this.section_normals = [
        0, -.7, -.7,
        0, -.7, .7,
        0, 1, 0,
        0, 0, -1,
        0, .7, -.7,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 0, 1,
        0, .7, -.7,
        0, -.7, -.7
    ];

    this.initBuffers = function(){
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        this.index_buffer = [];

        var step = this.length/this.n_sections;
        for (var offset = -this.length/2; offset <= this.length/2; offset += step){
            var new_section = this.section.slice();
            for (var coordinate = 0; coordinate < new_section.length; coordinate++){
                this.color_buffer.push(.4);
                this.color_buffer.push(.4);
                this.color_buffer.push(.4);
                switch (coordinate%3){
                    case 0:
                        new_section[coordinate] += offset;
                        break;
                    case 1:
                        new_section[coordinate] += this.ground_height;
                        break;
                    case 2:
                        break;
                }
            }

            this.position_buffer.push.apply(this.position_buffer, new_section);
            this.normal_buffer.push.apply(this.normal_buffer, this.section_normals);

        }

        for (var longitude = 0; longitude < this.n_sections; longitude++){
            for (var section = 0; section < this.section.length/3 - 1; section++){
                var first = section + longitude * this.section.length/3;
                var second = first + this.section.length/3;
                this.index_buffer.push(first);
                this.index_buffer.push(second);
                this.index_buffer.push(first + 1);

                this.index_buffer.push(second);
                this.index_buffer.push(second + 1);
                this.index_buffer.push(first + 1);
            }
        }

        this.bufferize();
    };

    this.drawMode = function() {
        gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}