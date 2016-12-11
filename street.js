function Street(data){
    RoadPiece.call(this, data);

    this.section = [
        0, .50, 6,
        0, .50, -6
    ];

    this.section_normals = [
        0, 1, 0,
        0, 1, 0
    ];

    this.section_tangents = [
        1, 0, 0,
        1, 0, 0
    ];

    this.textureCoordinates = function(v){
        return [
            0, v,
            1, v
        ];
    };
}