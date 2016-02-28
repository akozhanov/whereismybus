var tools = require("./tools.js");
var test_tools = require("./test-tools.js");

exports.test1 = function (test) {

    var res = tools.getPosOnRouteDir(test_tools.loc1, test_tools.route.directions[0]);

    var expRes = {
        location: test_tools.loc1,
        prevRouteMarker: test_tools.route.directions[0].points[363],
        nextRouteMarker: test_tools.route.directions[0].points[364],
        prevBusStop: test_tools.route.directions[0].points[362],
        nextBusStop: test_tools.route.directions[0].points[429]
    };
    test.deepEqual(res, expRes);
    test.done();
};

exports.test2 = function (test) {

    var res = tools.getPosOnRouteDir(test_tools.loc2, test_tools.route.directions[0]);

    var expRes = {
        location: test_tools.loc2,
        prevRouteMarker: test_tools.route.directions[0].points[171],
        nextRouteMarker: test_tools.route.directions[0].points[172],
        prevBusStop: {},
        nextBusStop: {}
    };
    test.deepEqual(res, expRes);
    test.done();
};

exports.test3 = function (test) {

    var res = tools.getPosOnRouteDir(test_tools.loc3, test_tools.route.directions[0]);

    var expRes = {
        location: test_tools.loc3,
        prevRouteMarker: test_tools.route.directions[0].points[494],
        nextRouteMarker: test_tools.route.directions[0].points[496],
        prevBusStop: {},
        nextBusStop: {}
    };
    test.deepEqual(res, expRes);
    test.done();
};

exports.test4 = function (test) {

    var res = tools.getPosOnRouteDir(test_tools.loc4, test_tools.route.directions[0]);

    var expRes = {
        location: test_tools.loc4,
        prevRouteMarker: test_tools.route.directions[0].points[479],
        nextRouteMarker: test_tools.route.directions[0].points[480],
        prevBusStop: {},
        nextBusStop: {}
    };
    test.deepEqual(res, expRes);
    test.done();
};

exports.test5 = function (test) {

    var res = tools.getPosOnRouteDir(test_tools.loc5, test_tools.route.directions[0]);

    var expRes = {
        location: test_tools.loc5,
        prevRouteMarker: test_tools.route.directions[0].points[475],
        nextRouteMarker: test_tools.route.directions[0].points[476],
        prevBusStop: {},
        nextBusStop: {}
    };
    test.deepEqual(res, expRes);
    test.done();
};
