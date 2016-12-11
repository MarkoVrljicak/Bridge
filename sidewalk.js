function Sidewalk(data) {
    RoadPiece.call(this, data);

    this.section = [
        0, .1, 6,
        0, .1, -6,
        0, 1, -6,
        0, 1, -8,
        0, -.5, -8,
        0, -.5, 8,
        0, 1, 8,
        0, 1, 6,
        0, .1, 6
    ];

    this.section_normals = [
        0, .7, -.7,
        0, .7, .7,
        0, .7, .7,
        0, .7, -.7,
        0, -.7, -.7,
        0, -.7, .7,
        0, .7, .7,
        0, .7, -.7,
        0, .7, -.7
    ];

    this.section_tangents = [];
    for (var i = 0; i < this.section_normals.length/3; i++){
        this.section_tangents.push(1);
        this.section_tangents.push(0);
        this.section_tangents.push(0);
    }

    this.textureCoordinates = function (v) {
        return [
            0, v, // TODO: Arreglar
            0, v,
            1 / 22, v,
            3 / 22, v,
            6 / 22, v,
            16 / 22, v,
            19 / 22, v,
            21 / 22, v,
            1, v
        ];
    }
}