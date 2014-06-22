d3.layout.trail = function() {

    var that = {}; //output object

    var time = function() {}, //how to access the time data (must be numeric--should but doesn't handle dates);
        currentTime, //points of this time will be display with full opacity;
        //later points are dropped;
        decayRange,  //points of this age will have opacity 0. If either currentTime or decayRange is not defined, opacity will be added as some undefined values.
        data,       // the data being arranged
        positioner, // a function that returns the [x,y] for the point.
        sort,       // a function specifying the sort order
        coordType = 'coordinates', //either "coordinates" or "xy"; if the first, returns a "coordinates" array; if the latter, returns x1,y1,x2,y2
        grouping; // a function to split the data up into multiple segments;

    grouping = function(d) {
        return 1
    }

    positioner = function(datum) {
        //given a datum, returns an [x,y] array.
        //Might be a projection, for example, or a scale output.
        return [datum.x,datum.y]
    }


    lineToSegments = function(values) {
        //the returned array will be filtered to only include segments that fit the defined values.

        if (currentTime != undefined & decayRange != undefined) {
            values = values.filter(function(d) {
                return (time(d) <= currentTime && time(d) >= (currentTime-decayRange))
            })
        }



        values = d3
            .nest()
            .key(function(d) {return grouping(d)})
            .entries(values);

        tmp = values;

        output = [];


        var i = 0
        values.forEach(function(element) {
            i++;
	    if (sort!=undefined) {
		element.values.sort(sort)
	    }
            if (i==1) {
                //console.log(element)
	    }
            var values = element.values;

            for (var i = 0; i < (values.length); i++) {
                var current = values[i];
                if (values[i+1] != undefined) {
		    current.next = values[i+1]
		} else {
		    current.next = {}
		}
                if (values[i-1] != undefined) {
                    current.previous = values[i-1]
                    if (coordType=="coordinates") {
                        current.coordinates = [
                            positioner(values[i-1]),
                            positioner(values[i])
                        ]
                    } else if (coordType=="xy") {
                        var a = positioner(values[i-1]),
                            b = positioner(values[i]);
                        current.x1=a[0]
                        current.y1=a[1]
                        current.x2=b[0]
                        current.y2=b[1]
                    }
                    current.type = "LineString";
                    //opacity will probably be this: the percentage of the decay range ago that it was.
                    //Early tests should guarantee a result between 0 and 1.
                }
                current.opacity = 1-(currentTime-time(current))/decayRange
            }
	    output = output.concat(values);
        })
        return output;
    }

    that.layout = function() {
        output = lineToSegments(data);
        return output;
    }

    that.coordType = function(x) {
        if (!arguments.length) return coordType;
        coordType= x
        return that
    }

    that.grouping = function(x) {
        if (!arguments.length) return grouping;
        grouping= x
        return that
    }

    that.time = function(x) {
        if (!arguments.length) return time;
        time = x
        return that
    }

    that.currentTime = function(x) {
        if (!arguments.length) return currentTime;
        currentTime= x
        return that
    }

    that.decayRange = function(x) {
        if (!arguments.length) return decayRange;
        decayRange= x
        return that
    }

    that.data = function(x,append) {
        if (!arguments.length) return data;

        if (append) {
            data = data || [];
            data = data.concat(x)
        } else {
            data = x
        }

        return that
    }

    that.positioner = function(x) {
        if (!arguments.length) return positioner;
        positioner = x
        return that
    }
    that.sort = function(x) { 
 	if (!arguments.length) return sort; 
	    sort= x
 	return that
    } 
    


    return that;

}
