function Sidewalk(data) {
    RoadPiece.call(this, data);

    this.section = [
        0, .1, 6,
        0, .1, -6,
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
        0, 1, 0,
        0, 1, 0,
        0, 0, 1,
        0, .7, -.7,
        0, -.7, -.7,
        0, -.7, .7,
        0, 1, 0,
        0, 0, -1,
        0, .7, -.7,
        0, 1, 0
    ];

    this.textureCoordinates = function (v) {
        return [
            0, v,
            1, v,
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