class UserController{

    constructor(formId, tableId){
        this.formE1 = document.getElementById(formId);
        this.tableE1 = document.getElementById(tableId);
        this.onSubmit();
        this.onEditCancel();
    }

    onEditCancel(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate();
        });
    }


    onSubmit(){
        this.formE1.addEventListener("submit", event => {
            event.preventDefault();//Cancela o comportamento padrão de um evento(no caso o submit)
           
            let btn = this.formE1.querySelector('[type=submit]');
            btn.disabled = true;
            let values = this.getValues();
            if(!values){
                return false;
            }
            values.photo = "";

            this.getPhoto().then(
                (content) => {//Arrow function, é o mesmo que colocar o function(content)
                    values.photo = content;
                    this.addLine(values);
                    this.formE1.reset();
                    btn.disabled = false;
            }, 
            (e) =>{
                console.error(e);
            });
            // this.getPhoto((content)=>{
            //     values.photo = content;
            //     this.addLine(values);
            // });
        });
    }


    getPhoto(){


        return new Promise((resolve, reject) => {//Arrow function
            
            let fileReader = new FileReader();
            let elements = [...this.formE1.elements].filter(item => {
                if(item.name === 'photo'){
                    return item;
                }
            });
    
            let file = elements[0].files[0];
    
            fileReader.onload = ()=>{
                resolve(fileReader.result);
            };

            fileReader.onerror = (e) => {
                reject(e);
            };

            if(file){
                fileReader.readAsDataURL(file)
            }else{
                resolve('dist/img/boxed-bg.jpg');
            }
        });
    }
    // getPhoto(callback){
    //     let fileReader = new FileReader();
    //     let elements = [...this.formE1.elements].filter(item => {
    //         if(item.name === 'photo'){
    //             return item;
    //         }
    //     });

    //     let file = elements[0].files[0];

    //     fileReader.onload = ()=>{
    //         callback(fileReader.result);
    //     };
    //     fileReader.readAsDataURL(file);
    // }

    getValues(){
        let user = {};
        let isValid = true;
        //A partir do ES2015, foi introduzido o operador Spread (essa reticencias)
       [...this.formE1.elements].forEach(function(field, index){

        if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
            
            field.parentElement.classList.add('has-error');
            console.dir(field);
            isValid = false;
        }

     //   Array.from(this.formE1.elements).forEach(function(field, index){
 //       this.formE1.elements.forEach(function(field, index){
        //  console.log("index", index);
            if(field.name == "gender"){
                if(field.checked){
                    user.gender = field.value;
                }
            }else  if(field.name == 'admin'){
                user[field.name] = field.checked;
            }else{
                user[field.name] = field.value;
            }
        });
        if(!isValid){
            return false;
        }
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
    }

    addLine(dataUser){

        let tr = document.createElement('tr');
        tr.dataset.user = JSON.stringify(dataUser);
        tr.innerHTML = `
        <tr>
        <td>
        <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
        </td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${(dataUser.admin)  ? 'Sim' : 'Não'}</td>
        <td>${Utils.dateFormat((dataUser.register))}</td>
        <td>
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
        </tr>
        `;

        tr.querySelector(".btn-edit").addEventListener("click", e=>{
            console.log("tr -> ", JSON.parse(tr.dataset.user));
            this.showPanelUpdate();
        //    document.querySelector("#box-user-create").style.display = "none";
        //   document.querySelector("#box-user-update").style.display = "block";
        });

        this.tableE1.appendChild(tr);

        this.updateCount();
    }


    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    }
    
    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }

    updateCount(){

        let numberUser = 0;
        let numberAdmin = 0;

        [...this.tableE1.children].forEach(tr=>{
            numberUser++;
            let user = JSON.parse(tr.dataset.user);
            if(user._admin){
                numberAdmin++;
            }
        });
        document.querySelector("#number-users").innerHTML = numberUser;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
        

    }
}