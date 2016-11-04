function RiverPanel(data){
    var canvas = document.getElementById('river_draw');
    this.ctx = canvas.getContext('2d');

    this.scene_to_panel = function(x){
        return x * (180/300);
    };

    this.onMouseClick = function(){
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

    }

}