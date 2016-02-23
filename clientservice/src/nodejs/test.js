var tools = require("./tools.js");
var test_tools = require("./test-tools.js");

exports.test1 = function (test) {

    var res = tools.getPosOnRouteDir(test_tools.loc1, test_tools.route.directions[0]);

    var expRes = {
        location: test_tools.loc1,
        prevRouteMarker: test_tools.route.directions[0].points[363],
        nextRouteMarker: test_tools.route.directions[0].points[364],
        prevBusStop: {},
        nextBusStop: {}
    };
    test.deepEqual(res, expRes);
    test.done();
};

exports.test2 = function (test) {

    var res = tools.getPosOnRouteDir(test_tools.loc2, test_tools.route.directions[0]);

    var expRes = {
        location: test_tools.loc2,
        prevRouteMarker: test_tools.route.directions[0].points[363],
        nextRouteMarker: test_tools.route.directions[0].points[364],
        prevBusStop: {},
        nextBusStop: {}
    };
    test.deepEqual(res, expRes);
    test.done();
};
