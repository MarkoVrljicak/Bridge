function BezierCurve(control_points){
    Curve.call(this);

    this.control_points = control_points;

    this.get_points = function(){
        return this.control_points;
    };

    this.evaluate = function(t) {
        var res = [];
        var i;
        switch(this.control_points.length){
            case 3:
                for(i=0; i < 3; i++){
                    var b0 = this.control_points[0][i]*Math.pow(1.0-t, 2);
                    var b1 = this.control_points[1][i]*2*(1.0-t)*t;
                    var b2 = this.control_points[2][i]*Math.pow(t,2);
                    res[i] = b0 + b1 + b2;
                }
                break;
            case 4:
                for(i=0; i < 3; i++){
                    var y0 = this.control_points[0][i]*Math.pow(1.0-t,3);
                    var y1 = this.control_points[1][i]*3.0*Math.pow(1.0-t,2)*t;
                    var y2 = this.control_points[2][i]*3.0*(1.0-t)*Math.pow(t,2);
                    var y3 = this.control_points[3][i]*Math.pow(t, 3);
                    res[i] = y0 + y1 + y2 + y3;
                }
                break;
            default:
                throw "Invalid number of control points in Bezier curve.";
        }
        return res;
    };
}
