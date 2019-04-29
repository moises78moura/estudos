// let express = require('express');//carrega o modulo http

// let routes  = express.Router();

//cria um servidor http utilizando o express


module.exports = app =>{
    app.get('/',(req, res) =>{
    
        console.log("URL -> ", req.url);
        console.log("METHOD -> ", req.method);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1> Após a Teste show! </h1>');
        
    });
};