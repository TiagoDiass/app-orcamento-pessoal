let idDisponivel = (window.localStorage.length) + 1;

function salvarNoStorage(id, item){
    window.localStorage.setItem(id, item);
}

function pegarDoStorage(id){
    let item = window.localStorage.getItem(id);

    return item;
}

function deletarDoStorage(id){
    window.localStorage.removeItem(id);
}

function cadastrarDespesa(){
    let id = idDisponivel;
    idDisponivel++;

    let despesa = {
        ano: document.querySelector('#ano').value,
        mes: document.querySelector('#mes').value,
        dia: document.querySelector('#dia').value,
        tipo: document.querySelector('#tipo').value,
        descricao: document.querySelector('#descricao').value,
        valor: document.querySelector('#valor').value
    }

    //Variável que usaremos para armazenar o objeto em forma de JSON, para assim o passarmos para o localStorage
    let despesaJson;

    let objetoErro = verificarErros(despesa);
    
    if(objetoErro.erro != true){
        despesaJson = JSON.stringify(despesa);
        salvarNoStorage(id, despesaJson);
        exibirModalSucesso();
        limparCampos();
    }else{
        idDisponivel--;
        exibirModalErro(objetoErro.stringErro); 
    }   
}

//Função que usaremos para válidar os campos, e retornaremos um objeto com dois atributos, erro(true ou false) e stringErro, que especificará qual campo está inválido
function verificarErros({ ano, mes, dia, tipo, descricao, valor }){
    let erro = false;
    let stringErro = '';

    if(ano == ''){
        stringErro = 'ano';
        erro = true;
    }else if(mes == ''){
        stringErro = 'mês';
        erro = true;
    }else if(dia > 31 || dia < 1){
        stringErro = 'dia';
        erro = true;
    }else if(tipo == '0'){
        stringErro = 'tipo';
        erro = true;
    }else if(descricao == ''){
        stringErro = 'descrição';
        erro = true;
    }else if(valor <=  0){
        stringErro = 'valor';
        erro = true;
    }

    return{
        erro,
        stringErro
    };
}

function exibirModalSucesso(){
    
    //Formatando o MODAL para mensagem de SUCESSO
    document.getElementById('cabecalhoModal').className = 'modal-header text-success';
    document.getElementById('tituloModal').innerHTML = 'Registro inserido com sucesso';
    document.getElementById('msgModal').innerHTML = 'Despesa cadastrada com sucesso';
    document.getElementById('botaoModal').className = 'btn btn-success';
    document.getElementById('botaoModal').innerHTML = 'Voltar';
    
    let modal = document.getElementById('modalRegistraDespesa');
    $(modal).modal('show');
}

function exibirModalErro(stringErro){
    
    //Formatando o MODAL para mensagem de ERRO
    document.getElementById('cabecalhoModal').className = 'modal-header text-danger';
    document.getElementById('tituloModal').innerHTML = 'Erro na inclusão da despesa';
    document.getElementById('botaoModal').className = 'btn btn-danger';
    document.getElementById('botaoModal').innerHTML = 'Voltar e corrigir';

    let msgErro = document.getElementById('msgModal');

    if(stringErro == 'descrição'){    
        msgErro.innerHTML = 'Coloque uma descrição em sua despesa';
    }else{
        msgErro.innerHTML = `Escolha um ${stringErro} válido para sua despesa!`;
    }

    let modal = document.getElementById('modalRegistraDespesa');
    $(modal).modal('show');
}

function limparCampos(){
    document.getElementById('ano').value = '';
    document.getElementById('mes').value = '';
    document.getElementById('dia').value = '';
    document.getElementById('tipo').value = '0';
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';
}

function recuperarTodasDespesas(){
    let arrayDespesas = new Array();
    let tabela = document.querySelector('#tableBody');
    let qtdDespesas = window.localStorage.length;
    
    for(let i = 1; i <= qtdDespesas; i++){
        //Pegando a despesa no localStorage
        let despesa = pegarDoStorage(i);
        
        //Convertendo ela de JSON para Objeto
        despesa = JSON.parse(despesa);
        let tipoDespesa;

        switch(despesa.tipo){
            case '1':
                tipoDespesa = 'Alimentação';
                break;
            case '2':
                tipoDespesa = 'Educação';
                break;
            case '3':
                tipoDespesa = 'Lazer';
                break;
            case '4':
                tipoDespesa = 'Saúde';
                break;
            case '5':
                tipoDespesa = 'Transporte'
                break;
        }

        despesa.tipoDespesaString = tipoDespesa;
        despesa.id = i;

        arrayDespesas.push(despesa);
    }

    return arrayDespesas;
}

let arrayDespesas = recuperarTodasDespesas();

function renderDespesas(arrayDespesas){
    document.querySelector('#tableBody').innerHTML = '';

    arrayDespesas.forEach(despesa => {
        let tabela = document.querySelector('#tableBody')
        let listItemDespesa = document.createElement('tr');
    
        listItemDespesa.innerHTML = `
            <td>${despesa.dia} / ${despesa.mes} / ${despesa.ano}</td>
            <td>${despesa.tipoDespesaString}</td>
            <td>${despesa.descricao}</td>
            <td>R$ ${despesa.valor}</td>
            <button class="btn btn-danger" style="margin-top: 15%" onclick="deletarDespesa(${despesa.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        tabela.appendChild(listItemDespesa);

    })
}

function consultarDespesa(){
    let despesaProcurada = {
        ano: document.querySelector('#ano').value,
        mes: document.querySelector('#mes').value,
        dia: document.querySelector('#dia').value,
        tipo: document.querySelector('#tipo').value,
        descricao: document.querySelector('#descricao').value,
        valor: document.querySelector('#valor').value
    }

    pesquisarDespesa(despesaProcurada);
}

function pesquisarDespesa({ ano, mes, dia, tipo, descricao, valor }){
    let despesaProcurada = {
        ano,
        mes,
        dia,
        tipo,
        descricao,
        valor
    }

    //Fazendo uma cópia do array despesas para então filtrá-lo
    let despesasFiltradas =  recuperarTodasDespesas();
    
    //Verificando ano
    if(despesaProcurada.ano != ''){
        despesasFiltradas = despesasFiltradas.filter(despesa => {
            return despesa.ano == despesaProcurada.ano;
        });
    }

    //Verificando mês
    if(despesaProcurada.mes != ''){
        despesasFiltradas = despesasFiltradas.filter(despesa => {
            return despesa.mes == despesaProcurada.mes;
        });
    }

    //Verificando dia
    if(despesaProcurada.dia != ''){
        despesasFiltradas = despesasFiltradas.filter(despesa => {
            return despesa.dia == despesaProcurada.dia;
        });
    }

    //Verificando tipo
    if(despesaProcurada.tipo != '0'){
        despesasFiltradas = despesasFiltradas.filter(despesa => {
            return despesa.tipo == despesaProcurada.tipo;
        });
    }

    //Verificando descrição
    if(despesaProcurada.descricao != ''){
        despesasFiltradas = despesasFiltradas.filter(despesa => {
            return despesa.descricao == despesaProcurada.descricao;
        });
    }

    //Verificando valor
    if(despesaProcurada.valor != ''){
        despesasFiltradas = despesasFiltradas.filter(despesa => {
            return despesa.valor == despesaProcurada.valor;
        });
    }
    
    renderDespesas(despesasFiltradas);
}

function deletarDespesa(id){
    
    let tamanhoDoStorage = window.localStorage.length;
    
    deletarDoStorage(id);

    for(let i = id+1; i <= tamanhoDoStorage; i++){
        //Organizando o localStorage, alterando o ID dos outros registros
        let item = pegarDoStorage(i);
        deletarDoStorage(i);
        salvarNoStorage(i-1, item);
    }

    let novoArrayDespesas = recuperarTodasDespesas();    
    renderDespesas(novoArrayDespesas);
}