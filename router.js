function route(handle, pathname,request, response){
    if (typeof handle[pathname] === 'function') {
        return handle[pathname](request,response);
    }
    else {
        return "404 not found";
    }
}

exports.route = route;