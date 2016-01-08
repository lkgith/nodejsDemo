var http = require('http');
var url = require('url');

function start(route,handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        route(handle, pathname, request,response);
    }

    http.createServer(onRequest).listen(8888);
    console.log('Server running at http://127.0.0.1:8888/');
}

exports.start = start;