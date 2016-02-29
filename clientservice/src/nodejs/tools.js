var geolib = require("geolib");
var math = require("math");

exports.getPosOnRouteDir = function(loc, routeDir){
    //var debugObj = {};

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

    if (typeof debugObj != "undefined") {
        debugObj.loc = loc;
        debugObj.near = near;
        debugObj.prevToNear = prevToNear;
        debugObj.nextToNear = nextToNear;
        console.log("debug obj:",debugObj);
    }

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
        if (point.lat == near.lat && point.lon == near.lon) continue;
        if (point.type == "route-marker")
            return point;
    }
    return null;
}

function findNextToNear(near, routeDir) {
    for (var i = near.idx; i < routeDir.points.length; i++) {
        var point = routeDir.points[i];
        if (point.lat == near.lat && point.lon == near.lon) continue;
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
    var near = geolib.findNearest(loc, spots, 0, 0);
    return routeDir.points[spots[near.key].idx];
}

function isBetween(point, point1, point2){
    var poly = [
        exports.computeLatLng(math.max(point1.latitude,point2.latitude), math.min(point1.longitude,point2.longitude), -45, 0.005),
        exports.computeLatLng(math.max(point1.latitude,point2.latitude), math.max(point1.longitude,point2.longitude), 45, 0.005),
        exports.computeLatLng(math.min(point1.latitude,point2.latitude), math.max(point1.longitude,point2.longitude), 135, 0.005),
        exports.computeLatLng(math.min(point1.latitude,point2.latitude), math.min(point1.longitude,point2.longitude), -135, 0.005)
    ];
    return geolib.isPointInside(point,poly);
}

exports.computeLatLng = function(vLatitude, vLongitude, vAngle, vDistance) {
    var vNewLatLng = {};
    vDistance = vDistance / 6371;
    vAngle = ToRad(vAngle);

    var vLat1 = ToRad(vLatitude);
    var vLng1 = ToRad(vLongitude);

    var vNewLat = Math.asin(Math.sin(vLat1) * Math.cos(vDistance) +
        Math.cos(vLat1) * Math.sin(vDistance) * Math.cos(vAngle));

    var vNewLng = vLng1 + Math.atan2(Math.sin(vAngle) * Math.sin(vDistance) * Math.cos(vLat1),
            Math.cos(vDistance) - Math.sin(vLat1) * Math.sin(vNewLat));

    if (isNaN(vNewLat) || isNaN(vNewLng)) {
        return null;
    }

    vNewLatLng.latitude = ToDeg(vNewLat);
    vNewLatLng.longitude = ToDeg(vNewLng);

    return vNewLatLng;
}

function ToRad(vInput) {
    return vInput * Math.PI / 180;
}


function ToDeg(vInput) {
    return vInput * 180 / Math.PI;
}
