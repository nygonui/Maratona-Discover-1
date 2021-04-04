// objeto que faz com que abra e feche o id ="Modal" no HTML
const Modal = {
    open(){
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close (){
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}

// Array com as informações das transações
const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021'
    },
    {
        id: 2,
        description: 'Criação website',
        amount: 500000,
        date: '23/01/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021'
    },
    {
        id: 4,
        description: 'App',
        amount: 200000,
        date: '23/01/2021'
    }
    
]

// Objeto com os métodos de somar entradas e despesas, e fazer o total
const Transaction = {
    incomes() {
        // somar entradas
    },
    expenses() {
        // somar despesas
    },
    total() {
        // entradas - saídas
    }
}

// Objeto DOM = Document object modulador (nesse caso apenas o nome que demos ao objeto)
// Ele terá os métodos de colocar as informações dos dos objetos dentro do 
// array transactions no HTML
const DOM = {
    
    //atributo que seleciona dentro do documento html os valores passados
    //como parâmetros 
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        //cria um elemento com o método createElement do objeto document
        //como o parâmetro (string) que será o elemento criado
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        const amount = Utils.formatCurrency(transaction.amount)

        //chama o atributo do nosso objeto DOM e usa o método appendChild
        //appendChild irá adicionar o elemento tr(argumento) 
        //dentro dos elementos que são os valores do atributo
        DOM.transactionContainer.appendChild(tr)
    },

    //
    innerHTMLTransaction(transaction) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        //criando um corpo de html 
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${transaction.amount}</td>
            <td class="date">${transaction.date}</td>
            <td> 
                <img src="./assets/minus.svg" alt="Apagar Transação"> 
            </td>
        `
        return html
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
    }
}

//for.Ecah é um método do objeto Array que significa 'para cada'
//nesse caso estamos usando esse método no Array transactions, que para
//cada indice irá executar a função passada como argumento do método forEach 
transactions.forEach(function(transaction) {
    DOM.addTransaction(transaction)
})