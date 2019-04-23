//const http = require('http');//carrega o modulo http
const express = require('express');//carrega o modulo http

let app = express();


//cria um servidor http utilizando o express
app.get('/',(req, res) =>{
    
    console.log("URL -> ", req.url);
    console.log("METHOD -> ", req.method);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1> Após a Teste show! </h1>');
    
});

app.get('/users', (req, res) => {

    console.log("URL -> ", req.url);
    console.log("METHOD -> ", req.method);
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({users:[{
                    name:'Moises Moura', 
                    email:'moises@ig.com', 
                    id:1
                }]
            });
});


app.listen(3000, '127.0.0.1', ()=>{
    console.log("Servidor Rodando normalmente!!!");
});

//cria um servidor http
// let server = http.createServer((req, res) =>{
    
    //     console.log("URL -> ", req.url);
    //     console.log("METHOD -> ", req.method);
    
    
    //     switch(req.url){
        //         case '/':
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'text/html');
//             res.end('<h1> Após a inclusão show! </h1>');
//             break;
//         case '/users':
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.end(JSON.stringify({users:[{name:'Moises', email:'moises@ig.com', id:1}]}));

//     }
    
// });

// server.listen(3000, '127.0.0.1', ()=>{
//     console.log("Servidor Rodando normalmente!!!");
// });