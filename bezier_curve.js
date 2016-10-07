function BezierCurve(control_points){
    this.control_points = control_points;

    this.evaluate = function(t) {
        var res = [];
        for(var i=0; i < 3; i++){
            var y0 = this.control_points[0][i]*Math.pow(1.0-t,3);
            var y1 = this.control_points[1][i]*3.0*Math.pow(1.0-t,2)*t;
            var y2 = this.control_points[2][i]*3.0*(1.0-t)*Math.pow(t,2);
            var y3 = this.control_points[3][i]*Math.pow(t, 3);
            res[i] = y0 + y1 + y2 + y3;
        }
        return res;
    }
}
