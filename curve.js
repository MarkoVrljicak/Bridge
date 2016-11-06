function Curve(){
    this.control_points = [];

    this.get_point = function(x, y, z, tolerance){
        for (var i = 0; i < this.control_points.length; i++){
            if (
                Math.abs(this.control_points[i][0] - x) < tolerance &&
                Math.abs(this.control_points[i][1] - y) < tolerance &&
                Math.abs(this.control_points[i][2] - z) < tolerance
            ) return i;
        }
        return -1;
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

    this.remove_point = function(i){
        return this.control_points.splice(i, 1);
    };

    this.evaluate_by_x = function(x){
        return this._evaluate_by_coordinate(x, 1, .5, 0);
    };

    this.evaluate_by_z = function(z){
        return this._evaluate_by_coordinate(z, 1, .5, 2);
    };

    this._evaluate_by_coordinate = function(x, t, step, i){
        var acceptable_delta = 0.1;
        var res = this.evaluate(t);
        var distance_off = x-res[i];
        if (Math.abs(distance_off) <= acceptable_delta) {
            return res;
        } else if (distance_off < 0){
            return this._evaluate_by_coordinate(x, t-step, step/2, i);
        } else {
            return this._evaluate_by_coordinate(x, t+step, step/2, i);
        }
    }
}