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
    //refatoração -> para deixar mais claro e poder expandir o código futuramente
    all: transactions,
    incomes() {
        //somar todas as entradas
        let income = 0;

        //método forEach passando como argumento uma arrow function
        //pegar os amount das transações
        Transaction.all.forEach(transaction => {
            //verificar se são maiores que 0 e soma-las
            if(transaction.amount > 0){
                income += transaction.amount; 
            }
        })

        return income;
    },
    expenses() {
        //somar todas as saídas
        let expense = 0;

        //forEach, passando como argumento uma arrow function
        //pega o amount das transações
        Transaction.all.forEach(transaction => {
            //verifica se são menores que 0 e soma elas
            if(transaction.amount < 0){
                expense += transaction.amount;
            }
        })
   
        return expense;
    },
    total() {
        let total = Transaction.incomes() + Transaction.expenses()
        
        return total; 
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


        //chama o atributo do nosso objeto DOM e usa o método appendChild
        //appendChild irá adicionar o elemento tr(argumento) 
        //dentro dos elementos que são os valores do atributo
        DOM.transactionContainer.appendChild(tr)
    },

    //
    innerHTMLTransaction(transaction) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        //criando um corpo de html 
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td> 
                <img src="./assets/minus.svg" alt="Apagar Transação"> 
            </td>
        `
        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        //.replace(/\D/g, "algo") -> /0/g faz que troque todos os 0 da string
        //por "algo", usando o /\D/g vai trocar tudo o que não é número por
        //algo
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        //formatação para a moeda brasileira
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })

        return signal + value

    }
}

//for.Ecah é um método do objeto Array que significa 'para cada'
//nesse caso estamos usando esse método no Array transactions, que para
//cada indice irá executar a função passada como argumento do método forEach 
transactions.forEach(function(transaction) {
    DOM.addTransaction(transaction)
})

DOM.updateBalance()