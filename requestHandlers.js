var fs = require("fs");
var formidable = require("formidable"); 

function start (request,response) {
    var body = '<hmtl><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head><body><form action="/upload" enctype="multipart/form-data" method="post"><p>上传图片 <input type="file" name="upload" multiple="multiple"/><input type="submit" value="Submit" /></form></body></html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(request,response) {
  console.log("Request handler 'upload' was called.");
  var form = new formidable.IncomingForm();
  form.uploadDir='tmp';//文件上传临时存储目录,使用前需要手工在项目根目录下新建tmp目录
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    if(error) {//必须有对error的处理,否则会出现莫名其妙的错误
        throw error;
    }
    console.log("parsing done");
    fs.renameSync(files.upload.path, "/tmp/test.png");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
}

function show(request,response) {
  console.log("Request handler 'show' was called.");
  fs.readFile("/tmp/test.png", "binary", function(error, file) {
    if(error) {
      console.log(error);
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
