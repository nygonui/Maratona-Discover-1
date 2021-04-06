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

const Storage = {
    get(){
        //Retorna um dado que era JSON agora em Array usando o método parse()
        //o método getItem busca a chave passada e o jogo lógico para 
        //retornar um Array vazio caso a primeira propriedade não seja verdade
        //é para a função retornar um array de qualquer forma
        return JSON.parse(localStorage.getItem("dev.finace:transactions")) || []
    },

    set(transactions){
        
        //localStorage da acesso ao objeto Storage local, armazena dados
        //setItem("x", y) -> x = cahve / y = valor
        //vamos guardar no Storage local um dado na chave dev.finace:tra...
        //o valor passado esta transformando o nosso array em string com o uso do objeto e o método JSON.stringfy()
        //pois o Storage só aceita string         
        localStorage.setItem("dev.finance:transactions", JSON.stringify(transactions))
    }
}


// Objeto que mexe com as transações
const Transaction = {
    //refatoração -> para deixar mais claro e poder expandir o código futuramente
    all: Storage.get(),

    add(transaction) {
        //push() -> método atrelado as listas que adiciona determinada
        //informação ao final da lista selecionada, nesse caso 
        //Transaction.all === transaction[]
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        //splice() -> método atrelado as listas que remove da lista 
        //um dado de acordo com o index passado
        Transaction.all.splice(index, 1)

        App.reload()
    },

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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        //usando dataset.index=index para adiconar um atributo do tipo
        //data-index="{index}", onde o {index} será o número do índice de acordo
        //com a sua posição no array
        tr.dataset.index = index


        //chama o atributo do nosso objeto DOM e usa o método appendChild
        //appendChild irá adicionar o elemento tr(argumento) 
        //dentro dos elementos que são os valores do atributo
        DOM.transactionContainer.appendChild(tr)
    },

    //coloca as informações no HTML
    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        //criando um corpo de html 
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td> 
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Apagar Transação"> 
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
    },

    clearTransaction(){
        DOM.transactionContainer.innerHTML = ""
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

    },

    formatAmount(value) {
        value = Number(value) * 100 //para tirar o ponto ou virgula e podermos trabalhar com ele
        
        return value;
    },

    formatDate(date) {
        //Por padrão o input do tipo date retorna uma string no formato de
        //data americano yyyy-mm-dd, com o .split("-") estamos separando o
        //essa data em um array, e seu critério de separação é o "-"
        const splittedDate = date.split("-")
        //Aqui estamos retornando a data no nosso formato de saída
        // dd/mm/yyyy
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
}

const Form = {

    //pegando os valores os inputs do form do html e salvando no atributos
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    //pegando apenas os valores dos atributos que pegaram o input inteiro
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validatedFields(){
        //desestruturação
        /* 
            const description = Form.getValues().description
            const amount = Form.getValues().amount
            const date = Form.getValues().date

             mesma coisa que
        */
        const {description, amount, date} = Form.getValues()
        if(
            description.trim() === "" ||
             amount.trim() === "" || 
             date.trim() === ""){
                 throw new Error("Por favor, preencha todos os campos")
             }
    },

    formatValues() {
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        //faz com que não ocorra o evento padrão, de colocar todas as 
        //informações no link da página
        event.preventDefault()

        try{
            //verificar se todos os campos forão preenchidos
            Form.validatedFields()
            //formatar os dados para salvar
            const transaction = Form.formatValues()
            //salvar
            Transaction.add(transaction)
            //apagar os dados do formulário
            Form.clearFields()
            //modal feche
            Modal.close()
            //atualizar aplicação
            App.reload()
        }catch(error){
            alert(error.message)
        }


    }
}

const App = {
    initi() {
        //forEach é um método do objeto Array que significa 'para cada'
        //nesse caso estamos usando esse método no Array transactions, que para
        //cada indice irá executar a função passada como argumento do método forEach 
        Transaction.all.forEach((transaction, index) => {
            //adicona as novas transações na tabela de transações
            DOM.addTransaction(transaction,index)
        })

        //estamos atualizando os cards das entradas, saídas e total
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransaction()
        App.initi()
    }
}

App.initi()



