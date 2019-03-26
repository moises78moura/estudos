class CalculatorController{


    constructor(){
        //O '_' indica que por convenção o atributo é privado
       // this._displayCalculator = "0";
       this._audio = new Audio('click.mp3');
       this._audioOnOff = false;
       this._lastOperator = '';
       this._lastNumber = '';
       this._operation =[];
       this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
        this.pasteFromClipboard();
    }

    initialize(){
        this.setDisplayDateTime();
        //define a execução de alguma instrução de acordo com o intervalo de tempo especificado(ms). Retorna um ID como referencia.
        let interval = setInterval(()=>{// Arrow function -> ()=>{} representa uma função (os parenteses recebem os parametros),
            //no caso aqui, vai executar o setDisplayDateTime a cada segundo (1000ms)
            this.setDisplayDateTime();
        }, 1000);
        this.setLastNumberToDisplay();
        //Espera um periodo(tempo) especifico para executar uma função.
        // setTimeout(()=>{
        //   clearInterval(interval);//limpa um intervalo de tempo 
        //}, 10000);
        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            });
        });
    }

    toggleAudio(){
        console.log('this._audioOnOff ',this._audioOnOff);
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalculator;
        document.body.appendChild(input);

        input.select();
        document.execCommand("Copy");
        input.remove();
    }

    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalculator = parseFloat(text);
            console.log(text);
        });
    }
    
    initButtonsEvents(){
        //document.querySelector("#buttons > g");//indica para pegar a primeira tags 'g' que é filhas de 'buttons'
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");//indica para pegar todas as tags 'g' que são filhas de 'buttons' e de 'parts'
        buttons.forEach((btn, index )=> {
            this.addEventListenerAll(btn, 'click drag', e =>{
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.executeBtn(textBtn);
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{
                btn.style.cursor = "pointer";
            });
        });

    }

    initKeyBoard(){

        document.addEventListener('keyup', e=>{
            this.playAudio();
            switch(e.key){
            
                case 'Escape':
                    this.clearAll();
                    break;
                
                case 'Backspace':
                    this.cancelEntry();
                    break;
                
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calcular();
                    break;
               
                case '.':
                case ',':
                    this.addDot();
                    break;
    
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                    this.addOperation(parseFloat(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey){
                        this.copyToClipboard();
                    }
                    break;
                }
        });
    }
    
    executeBtn(value){
        this.playAudio();
        switch(value){
            
            case 'ac':
                this.clearAll();
                break;
            
            case 'ce':
                this.cancelEntry();
                break;
            
            case 'soma':
                this.addOperation('+');
                break;
            
            case 'subtracao':
                this.addOperation('-');
                break;
            
            case 'divisao':
                this.addOperation('/');
                break;
            
            case 'multiplicacao':
                this.addOperation('*');
                break;
            
            case 'porcento':
                this.addOperation('%');
                break;
            
            case 'igual':
                this.calcular();
                break;
           
            case 'ponto':
                this.addDot();
                break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                this.addOperation(parseFloat(value));
                break;
                
            default:
                this.setError();
                break;
            }
    }

    addDot(){
        let lastOperation = this.getLastOperation();

        console.log("lastOperation " , lastOperation);
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1){
            return;
        }

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }

    /**
     * retorna o ultimo elementeo do array.
     */
    getLastOperation(){
        return this._operation[this._operation.length - 1];
    }

    addOperation(value){

        if(isNaN(this.getLastOperation())){
            //string
            if(this.isOperator(value)){//troca operador
                this.setLastOperation(value);
            }else{
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }else{
            if(this.isOperator(value)){
                this.pushOperation(value);
            }else{
                //number
                let newValue = this.getLastOperation().toString() + value.toString();
                //this._operation.push(newValue);
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }
        }
        //this._operation.push(value);
    }

    getLastItem(isOperator = true){

        let  lastItem;
        for(let i = this._operation.length -1 ; i >=0 ; i-- ){
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
        }
        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay(){
        let  lastNumber = this.getLastItem(false);

        if(!lastNumber){
            lastNumber = 0;
        }
        this.displayCalculator = lastNumber;
    }
    
    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length > 3){
            this.calcular();
        }
    }
    
    getResult(){
        try{
            return eval(this._operation.join(""));
        }catch(e){
            setTimeout(() => {
                this.setError();
            }, 1);
        }
    }

    calcular(){

        let last = '';
        this._lastOperator = this.getLastItem();
        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        }else if(this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);
        }
        
        console.log('_lastOperator ', this._lastOperator);
        console.log('_lastNumber ', this._lastNumber);
        let result = this.getResult();
        
        if(last == "%"){
            result /= 100;
            this._operation = [result];
        }else{
            this._operation = [result];
            if(last){
                //this._operation = [last];
                this._operation.push(last);
            }
        }

        this.setLastNumberToDisplay();
    }

    setLastOperation(value){
        this._operation[this._operation.length -1] = value;
    }

    isOperator(value){
        return (['+','-','*','%','/'].indexOf(value) > -1);
    }

    setError(){
        this.displayCalculator = "ERROR";
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    cancelEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        this._timeEl.innerHTML ;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value ;
    }

    get displayDate(){
        this._dateEl.innerHTML;
    }
  
    set displayDate(value){
        this._dateEl.innerHTML = value;
    }

    get displayCalculator(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalculator(value){
        if(value.toString().length>10){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(currentDate){
        this._currentDate = currentDate;
    }
    
}