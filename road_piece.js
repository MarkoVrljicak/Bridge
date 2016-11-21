function RoadPiece(data){
    TexturedGeometry.call(this);

    this.length = data.side;
    this.n_sections = 300;
    this.ground_height = data.ph1;
    this.max_height = data.ph2;
    this.z_pos = data.bridge_pos;
    this.lowest_point = data.lowest_point;

    this.section = [];
    this.section_normals = [];

    this.initBuffers = function(){
        this.position_buffer = [];
        this.normal_buffer = [];
        this.index_buffer = [];
        this.texture_coord_buffer = [];

        var step = this.length/this.n_sections;
        for (var offset = -this.length/2; offset <= this.length/2; offset += step){
            var new_section = this.section.slice();
            for (var coordinate = 0; coordinate < new_section.length; coordinate++){
                switch (coordinate%3){
                    case 0:
                        new_section[coordinate] += offset;
                        break;
                    case 1:
                        new_section[coordinate] += this.ground_height;
                        var dist = Math.abs(new_section[coordinate-1] - this.lowest_point[0]);
                        if (dist <= data.river_width/2){
                            new_section[coordinate] +=
                                Math.cos((Math.PI/2)*(dist/(data.river_width/2)))*this.max_height;
                        }
                        break;
                    case 2:
                        new_section[coordinate] += this.z_pos;
                        break;
                }
            }
            this.position_buffer.push.apply(this.position_buffer, new_section);
            this.normal_buffer.push.apply(this.normal_buffer, this.section_normals);
            var v = 0.5 + offset/this.length;
            this.texture_coord_buffer.push.apply(this.texture_coord_buffer, this.textureCoordinates(v));
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