//npm install //instala/atualiza as dependencias do projeto
//npm install 'express' --save instala o pacote e inclui a dependencia no package.json
//npm install 'nodemon' -g  instala o pacote mas não inclui a dependencia no package.json
//node 'nome do arquivo js' executa o arquivo
//npm install consign --save instala o consign para trabalhar com rotas
//npm install body-parser --save


//const http = require('http');//carrega o modulo http
const express = require('express');//carrega o módulo express, nesse caso procura em 'node_modules'
const consign = require('consign');
const bodyParser = require('body-parser');

// let routeIndex = require('./routes/index');//carrega o módulo exportado do index principal.
// let routeUsers = require('./routes/users');//carrega o módulo exportado do users.
let app = express();
app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());
consign().include('routes').into(app);

// app.use(routeIndex);
// app.use("/users",routeUsers);
//Rota exportada para o arquivo/diretorio /routes/index.js
//cria um servidor http utilizando o express
// app.get('/',(req, res) =>{
    
    //     console.log("URL -> ", req.url);
    //     console.log("METHOD -> ", req.method);
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/html');
    //     res.end('<h1> Após a Teste show! </h1>');
    
    // });
    
//Rota exportada para o arquivo/diretorio /routes/users.js
    // app.get('/users', (req, res) => {
//     console.log("URL -> ", req.url);
//     console.log("METHOD -> ", req.method);
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({users:[{
//                     name:'Moises Moura Moura', 
//                     email:'moises@ig.com', 
//                     id:1
//                 }]
//             });
// });

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