nodejsDemo
=========

##概要

很多像我一样从零开始学习nodejs的朋友们都会看一个博客
[Node入门](http://www.nodebeginner.org/index-zh-cn.html)
,然后根据其提供的例子从头到尾敲出这个demo来。最开始只简单展示"hello world"的时候,你会发现没任何问题,可是跟着走完整个流程的时候,你会发现会出现莫名其妙的问题.本文是我在敲其提供的例子时遇到的一些坑并对这些问题给出解决方案。

```
##项目结构
项目结构如下:
nodejsDemo
----index.js 项目入口
----server.js 服务搭建
----router.js  路由
----requestHandlers.js 路由处理
----tmp 文件临时存储路径

```
##错误及解答
###1、
``` javascript
{ [Error: ENOENT, open './tmp/test.png'] errno: 34, code: 'ENOENT', path: './tmp/test.png' }
```
原因可能有多个:
a)移动文件时使用
``` javascript
fs.renameSync(files.upload.path, "/tmp/test.png");
```
读取文件时使用
``` javascript
fs.readFile("./tmp/test.png", "binary", function(error, file) {})
```
两者应该保持路径一致。同为:"/tmp/test.png"或者"./tmp/test.png"
修改为:
``` javascript
fs.renameSync(files.upload.path, "/tmp/test.png");
```
和
``` javascript
fs.readFile("/tmp/test.png", "binary", function(error, file) {})
```
或者
``` javascript
fs.renameSync(files.upload.path, "./tmp/test.png");
```
和
``` javascript
fs.readFile("./tmp/test.png", "binary", function(error, file) {})
```
b)
###2、
``` javascript
fs.renameSync(files.upload.path, "/tmp/test.png");
                              ^
TypeError: Cannot read property 'path' of undefined
    at /Users/baidu/me/learn/nodejs3/nodejsDemo/requestHandlers.js:21:31
    at IncomingForm.<anonymous> (/Users/baidu/node_modules/formidable/lib/incoming_form.js:105:9)
    at IncomingForm.emit (events.js:92:17)
    at IncomingForm._maybeEnd (/Users/baidu/node_modules/formidable/lib/incoming_form.js:553:8)
    at QuerystringParser.parser.onEnd (/Users/baidu/node_modules/formidable/lib/incoming_form.js:447:10)
    at QuerystringParser.end (/Users/baidu/node_modules/formidable/lib/querystring_parser.js:25:8)
    at IncomingMessage.<anonymous> (/Users/baidu/node_modules/formidable/lib/incoming_form.js:130:30)
    at IncomingMessage.emit (events.js:92:17)
    at _stream_readable.js:944:16
    at process._tickCallback (node.js:448:13)
```
错误解读:
files.upload不存在或者不存在path属性,打印
files.upload
``` javascript
    console.log("files",files);
    fs.renameSync(files.upload.path, "/tmp/test.png");
```
    发现结果如下:
``` javascript
    files {}
```
说明上传文件不存在
原因:
a)form标签中需添加属性
``` html
【enctype="multipart/form-data"】
```
表示上传的是文件
b)
``` javascript
form.parse(request, function(error, fields, files) {
    fs.renameSync(files.upload.path, "/tmp/test.png");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();}
```
需要有对错误的处理,修改为:
``` javascript
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
```
###3、
``` javascript
/Users/baidu/node_modules/formidable/lib/incoming_form.js:302
  if (this.headers['content-length']) {
                  ^
TypeError: Cannot read property 'content-length' of undefined
    at IncomingForm._parseContentLength (/Users/baidu/node_modules/formidable/lib/incoming_form.js:302:19)
    at IncomingForm.writeHeaders (/Users/baidu/node_modules/formidable/lib/incoming_form.js:141:8)
    at IncomingForm.parse (/Users/baidu/node_modules/formidable/lib/incoming_form.js:110:8)
    at Object.upload [as /upload] (/Users/baidu/me/learn/nodejs3/nodejsDemo/requestHandlers.js:16:8)
    at route (/Users/baidu/me/learn/nodejs3/nodejsDemo/router.js:3:32)
    at Server.onRequest (/Users/baidu/me/learn/nodejs3/nodejsDemo/server.js:7:9)
    at Server.emit (events.js:98:17)
    at HTTPParser.parser.onIncoming (http.js:2109:12)
    at HTTPParser.parserOnHeadersComplete [as onHeadersComplete] (http.js:122:23)
    at Socket.socket.ondata (http.js:1967:22)
```
原因:
``` javascript
function upload(response,request) {
  console.log("Request handler 'upload' was called.");
  var form = new formidable.IncomingForm();.....}
  ```
  中request和response位置写反,修改为:
  ``` javascript
function upload(request,response) {
  console.log("Request handler 'upload' was called.");
  var form = new formidable.IncomingForm();.....}

```


其它就不多说了，看代码吧：）

