var geolib = require("geolib");
var math = require("math");

exports.getPosOnRouteDir = function(loc, routeDir){
    var res = {
        location: loc,
        prevRouteMarker: {},
        nextRouteMarker: {},
        prevBusStop: {},
        nextBusStop: {}
    };
    var near = getNearestRouteMarker(loc,routeDir);
    var prevToNear = findPrevToNear(near,routeDir);
    var nextToNear = findNextToNear(near,routeDir);

    if (isBetween(loc,getLocFromRoutePoint(prevToNear),getLocFromRoutePoint(near))){
        res.prevRouteMarker = prevToNear;
        res.nextRouteMarker = near;
    }

    if (isBetween(loc,getLocFromRoutePoint(near),getLocFromRoutePoint(nextToNear))){
        res.prevRouteMarker = near;
        res.nextRouteMarker = nextToNear;
    }

    return res;
};

function findPrevToNear(near, routeDir) {
    for (var i = near.idx; i > 0; i--) {
        var point = routeDir.points[i];
        if (point == near) continue;
        if (point.type == "route-marker")
            return point;
    }
    return null;
}

function findNextToNear(near, routeDir) {
    for (var i = near.idx; i < routeDir.points.length; i++) {
        var point = routeDir.points[i];
        if (point == near) continue;
        if (point.type == "route-marker")
            return point;
    }
    return null;
}

function getLocFromRoutePoint(routePoint) {
    return {
        latitude: routePoint.lat,
        longitude: routePoint.lon,
        name: routePoint.name
    }
}

function getNearestRouteMarker(loc,routeDir){
    var spots = {};
    for (var i in routeDir.points) {
        var point = routeDir.points[i];
        if (point.type == "route-marker")
            spots[point.name] = {latitude: point.lat, longitude: point.lon, idx: point.idx};
    }
    var near = geolib.findNearest(loc, spots, 1);
    return routeDir.points[spots[near.key].idx];
}

function isBetween(point, point1, point2){
    var poly = [
        {latitude: math.max(point1.latitude,point2.latitude), longitude:math.min(point1.longitude,point2.longitude)},
        {latitude: math.max(point1.latitude,point2.latitude), longitude:math.max(point1.longitude,point2.longitude)},
        {latitude: math.min(point1.latitude,point2.latitude), longitude:math.max(point1.longitude,point2.longitude)},
        {latitude: math.min(point1.latitude,point2.latitude), longitude:math.min(point1.longitude,point2.longitude)}
    ];
    console.log(poly);
    return geolib.isPointInside(point,poly);
}
