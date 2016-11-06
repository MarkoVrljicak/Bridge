function BSpline(control_points){
    Curve.call(this);

    if (control_points.length < 2) {
        throw "B-Spline has less than 2 control points";
    }
    this.control_points = control_points;

    this.get_points = function(){
        return this.control_points;
    };

    this.evaluate = function(t) {
        var n_bases = this.control_points.length - 2;
        var interval_per_curve = 1/n_bases;
        var i = 0;
        while (interval_per_curve*(i+1) < t) i++;

        var curve = new BSplineBase(
            [this.control_points[i], this.control_points[i+1], this.control_points[i+2]],
            i == 0,
            i + 1 == n_bases
        );
        var new_t = t - interval_per_curve*i;
        new_t *= n_bases;
        return curve.evaluate(new_t);
    };


}
