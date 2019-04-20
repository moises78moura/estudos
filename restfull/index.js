const http = require('http');//carrega o modulo http

//cria um servidor http
let server = http.createServer((req, res) =>{

    console.log("URL -> ", req.url);
    console.log("METHOD -> ", req.method);

   
    switch(req.url){
        case '/':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('<h1> Olá </h1>');
            break;
        case '/users':
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({users:[{name:'Moises', email:'moises@ig.com', id:'1'}]}));

    }
    
});

server.listen(3000, '127.0.0.1', ()=>{
    console.log("Servidor Rodando normalmente!!!");
});