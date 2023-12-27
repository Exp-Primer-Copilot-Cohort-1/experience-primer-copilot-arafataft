// Create web server
// Run: node comment.js
// Access: http://localhost:3000/comment.html
// Access: http://localhost:3000/comment.js
// Access: http://localhost:3000/comment.css
var fs = require('fs');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;
    var title = queryData.id;
    var sanitizeTitle = sanitizeHtml(title);
    var description = queryData.description;
    var sanitizeDescription = sanitizeHtml(description);
    var body = '';
    var control = '';
    var sanitizeControl = '';
    var filteredId = path.parse(queryData.id).base;
    var filteredDescription = path.parse(queryData.description).base;

    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data',function(error,filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.HTML(title,list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        fs.readdir('./data',function(error,filelist){
          var list = template.list(filelist);
          fs.readFile(`./data/${filteredId}`, 'utf8', function(err,description){
            var title = filteredId;
            var sanitizeTitle = sanitizeHtml(title);
            var sanitizeDescription = sanitizeHtml(description);
            var html = template.HTML(title,list,
              `<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
              `<a href="/create">create</a>
               <a href="/update?id=${sanitizeTitle}">update</a>
               <form action="delete_process" method="post">
                 <input type="hidden" name="id" value="${sanitizeTitle}">
                 <input type="submit" value="delete">
               </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(path