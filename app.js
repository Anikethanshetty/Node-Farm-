const fs = require('fs');
const http = require('http');
const { dirname } = require('path');
const url = require('url');
const replaceTemplate = require('./modules/replacetemplate')

//server

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html` , 'utf-8');
const tempProductview = fs.readFileSync(`${__dirname}/templates/template-product.html` , 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html` , 'utf-8');

 
 //JSON FILE READER
 const data = fs.readFileSync(`${__dirname}/dev-data/data.json` , 'utf-8');
 const dataObj = JSON.parse(data);
    
const server = http.createServer((req,res)=>{
    const {query,pathname} = url.parse(req.url,true);

    //OVERVIEW PAGE
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'Content-type' : 'text/html'})
         const cardsHtml = dataObj.map( el => replaceTemplate(tempCard , el) ).join('')
         const output = tempOverview.replace('{%PRODUCT_CARDS%' , cardsHtml);
         res.end(output);

    }


    //PRODUCT PAGE
        else if (pathname === '/product') {
            const product = dataObj[query.id];
            if (!product) {
                res.writeHead(404, { 'Content-type': 'text/html' });
                res.end('<h1>Product not found!</h1>');
            } else {
                const output = replaceTemplate(tempProductview, product);
                res.writeHead(200, { 'Content-type': 'text/html' });
                res.end(output);
            }
        }

    
    //API PAGE
    else if(pathname === '/api'){
    
            //WAY TO PRINT JSON FILE TO WINDOW
            res.writeHead(200,{'Content-type' : 'application/json'})
            res.end((data))
        }
          
        //NOT FOUND PAGE 
        else{    
           res.writeHead(404,{
               'Content-type' : 'text/html',
               'my-header' : 'heloo error'
           });
            res.end("<h1>page not found</h1>");
        }
        
    });
    
    
    server.listen(3000,'127.0.0.1',()=>{
        console.log("server started");
    })




            
       
