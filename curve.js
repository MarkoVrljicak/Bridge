function Curve(){
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