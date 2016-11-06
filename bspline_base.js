function BSplineBase(control_points, is_first, is_last){
    Curve.call(this);
    if (control_points.length != 3) throw "BSpline base needs to be quadratic";

    this.control_points = control_points;

    this.evaluate = function(t){
        var m;
        if (is_first && is_last){
            return (new BezierCurve(this.control_points)).evaluate(t);
        } else if (is_first){
            m = [
                (2*Math.pow(t, 2)-(4*t)+2),
                ((-3*Math.pow(t, 2))+(4*t)),
                Math.pow(t,2)
            ];
        } else if (is_last){
            m = [
                (Math.pow(t, 2)-(2*t)+1),
                ((-3*Math.pow(t, 2))+(2*t)+1),
                2*Math.pow(t,2)
            ];
        } else {
            m = [
                (Math.pow(t, 2)-(2*t)+1),
                ((-2*Math.pow(t, 2))+(2*t)+1),
                Math.pow(t,2)
            ];
        }

        var res = [];
        for(var i=0; i < 3; i++){
            var b0 = this.control_points[0][i]*.5*m[0];
            var b1 = this.control_points[1][i]*.5*m[1];
            var b2 = this.control_points[2][i]*.5*m[2];
            res[i] = b0 + b1 + b2;
        }
        return res;
    }
}