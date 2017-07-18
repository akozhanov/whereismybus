var test = require('tape');
var requestPromise = require('request-promise');

test('get-send', function (t){

    var options = {
        method: 'GET',
        // uri: 'http://172.19.0.3:10000/data/226?time=2015-09-03T10:16:50Z&lat=50.5174202&long=30.4485796&s=0.0&dir=0.0&sat=25&alt=0.0&acc=26.23900032043457&prov=network&batt=28.0&aid=8a53003a7f32ce99&ser=LGD856cd544cf6',
        uri: 'http://wimb-dataservice:10000/date/226?time=2015-09-03T10:16:50Z&lat=50.5174202&long=30.4485796&s=0.0&dir=0.0&sat=25&alt=0.0&acc=26.23900032043457&prov=network&batt=28.0&aid=8a53003a7f32ce99&ser=LGD856cd544cf6',
        resolveWithFullResponse: true
    };
    requestPromise(options).then(function (response){
        t.comment(response.statusCode);
        t.pass("good");
    }).catch(function (err){
        t.comment(err.statusCode);
        t.fail(err);
    });
    t.end();
})

test('simple', function(t){
    t.equal(2+3,5,'must be equal');
    t.end();
});
