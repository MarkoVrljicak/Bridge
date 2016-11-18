function RiverPanel(data){
    var canvas = document.getElementById('river_draw');
    this.ctx = canvas.getContext('2d');

    this.scene_to_panel = function(c){
        return 180 - c * (180/300);
    };

    this.panel_to_scene = function(c){
        return 300 - c * (300/180);
    };

    this.onMouseClick = function(e){
        var x = e.pageX, z = e.pageY;
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        z = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        x -= canvas.offsetLeft;
        z -= canvas.offsetTop;
        var tolerance = 8;

        if (x < 0 || x > 180 || z < 0 || z > 180) return;

        var element = data.river_curve.get_point(this.panel_to_scene(x), 0, this.panel_to_scene(z), tolerance);
        if (
            element > 0 &&
            element < data.river_curve.get_points().length -1 &&
            data.river_curve.control_points.length > 3) {
            data.river_curve.remove_point(element);
        } else if (element == -1) {
            data.river_curve.add_point([this.panel_to_scene(x), 0, this.panel_to_scene(z)]);
        }

        this.ctx.clearRect(0, 0, 180, 180);
        this.draw();
    };

    this.draw = function(){
        this.ctx.fillStyle = "rgba(50, 200, 50, 0.5)";
        this.ctx.fillRect(0, 0, 180, 180);
        this.ctx.beginPath();
        var eval0, eval1;
        this.ctx.strokeStyle = 'blue';
        this.ctx.lineWidth = 2;
        for (var i = 1; i < 180; i++){
            eval0 = data.river_curve.evaluate((i-1)/180);
            eval1 = data.river_curve.evaluate(i/180);
            this.ctx.moveTo(this.scene_to_panel(eval0[0]),this.scene_to_panel(eval0[2]));
            this.ctx.lineTo(this.scene_to_panel(eval1[0]),this.scene_to_panel(eval1[2]));
        }
        this.ctx.stroke();

        var points = data.river_curve.get_points();
        this.ctx.fillStyle = "rgba(200, 0, 50, 1)";
        for (i = 0; i < points.length; i++){
            this.ctx.fillRect(this.scene_to_panel(points[i][0])-2, this.scene_to_panel(points[i][2])-2, 4, 4);
        }

        this.ctx.setLineDash([5, 3]);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (i = 1; i < points.length; i++){
            this.ctx.moveTo(this.scene_to_panel(points[i-1][0]),this.scene_to_panel(points[i-1][2]));
            this.ctx.lineTo(this.scene_to_panel(points[i][0]), this.scene_to_panel(points[i][2]));
        }
        this.ctx.stroke();
    }

}