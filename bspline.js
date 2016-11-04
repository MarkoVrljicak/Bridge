function BSpline(control_points){
    Curve.call(this);

    if (control_points.length < 3) {
        throw "B-Spline has less than 3 control points";
    } else if ((control_points.length-3)%2 != 0) {
        console.log((control_points.length-3)%2);
        throw "B-Spline cannot be subdivided into quadratic Bezier curves";
    }
    this.control_points = control_points;

    this.get_points = function(){
        return this.control_points;
    };

    this.add_point = function(point){
        this.control_points.push(point);
        this.control_points.sort(
            function(a, b){
                var x=a[2];
                var y=b[2];
                return x-y;
        });
    };

    this.evaluate = function(t) {
        var n_curves = 1 + ((this.control_points.length-3)/2);
        var interval_per_curve = 1/n_curves;
        var i = 0;
        while (interval_per_curve*(i+1) < t) i++;
        var curve = new BezierCurve(
            [this.control_points[2*i], this.control_points[2*i+1], this.control_points[2*i+2]]
        );
        var new_t = t - interval_per_curve*i;
        new_t *= n_curves;
        return curve.evaluate(new_t);
    };


}
