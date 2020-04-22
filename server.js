const express = require('express');
const nunjucks = require('nunjucks');

const server = express();

server.use(express.urlencoded({ extended: true }));

server.use(express.static('public'));

server.set('view engine', 'njk');

nunjucks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
});

server.get('/', (req, res) => {
    const page = {
        headTitle: 'Registro',
        onload: '',
        active: 'Registro',
        mainTitle: 'Registro de nova despesa',
        mainButtonClass: 'fas fa-plus',
        mainFunction: 'cadastrarDespesa'
    }
    res.render('index', { page });
}); 

server.get('/consulta', (req, res) => {

    const page = {
        headTitle: 'Consulta',
        onload: 'renderDespesas(arrayDespesas)',
        active: 'Consulta',
        mainTitle: 'Consulta de despesas',
        mainButtonClass: 'fas fa-search',
        mainFunction: 'consultarDespesa'
    }

    res.render('consulta', { page });
});

server.listen(5000, () => {
    console.log('Servidor está rodando na porta 5000 amigão');
})