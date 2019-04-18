class UserController{

    constructor(formIdCreate,formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableE1 = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }




    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", event => {

            event.preventDefault();
            
            let btn = this.formUpdateEl.querySelector("[type=submit]");
           
            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableE1.rows[index];
            
            let userOld = JSON.parse(tr.dataset.user);

            console.log("userOld._photo ", userOld._photo);
            console.log("!values.photo", !values._photo);

            let result = Object.assign({},userOld,values);//Object.assign -> copia o valor de atributos de um objeto para outro, retornando um novo objeto 'o objeto da esquer'
            
           

            this.getPhoto(this.formUpdateEl).then(
                (content) => {//Arrow function, é o mesmo que colocar o function(content)
                    if(!values.photo) {
                        result._photo = userOld._photo;
                    }else{
                        result._photo = content;
                    }
                  //  tr.dataset.user = JSON.stringify(result);// Transforma um objeto JSON em uma String

                    let user = new User();

                    user.loadFromJSON(result);
                    user.save();
                    this.getTr(user, tr);
                
                    this.updateCount();

                    this.formUpdateEl.reset();
                    this.showPanelCreate();
                    btn.disabled = false;
            }, 
            (e) =>{
                console.error(e);
            });
           

        });
    }


    onSubmit(){
        this.formEl.addEventListener("submit", event => {
            event.preventDefault();//Cancela o comportamento padrão de um evento(no caso o submit)
           
            let btn = this.formEl.querySelector('[type=submit]');
            btn.disabled = true;
            let values = this.getValues(this.formEl);
            if(!values){
                return false;
            }
            values.photo = "";

            this.getPhoto(this.formEl).then(
                (content) => {//Arrow function, é o mesmo que colocar o function(content)
                    values.photo = content;

                    values.save();
                    //this.insert(values);
                    this.addLine(values);
                    this.formEl.reset();
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


    getPhoto(formEl){


        return new Promise((resolve, reject) => {//Arrow function
            
            let fileReader = new FileReader();
            let elements = [...formEl.elements].filter(item => {
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
    //     let elements = [...this.formEl.elements].filter(item => {
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

    getValues(formEl){
        let user = {};
        let isValid = true;
        //A partir do ES2015, foi introduzido o operador Spread (essa reticencias)
       [...formEl.elements].forEach(function(field, index){

            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                
                field.parentElement.classList.add('has-error');
                console.dir(field);
                isValid = false;
            }
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

    selectAll(){
        let users = User.getUsersStorage();

        users.forEach(dataUser=>{
            let user = new User();
            user.loadFromJSON(dataUser);
            this.addLine(user);
        });
    }

    // insert(data){
        
    //     let users = this.getUsersStorage();
    //     users.push(data);
    //     localStorage.setItem("users",JSON.stringify(users));//para de chave e valor, param 1 = chave, param 2 = valor
    //     //sessionStorage.setItem("users",JSON.stringify(users));//para de chave e valor, param 1 = chave, param 2 = valor
    // }

  
    addLine(dataUser){

        let tr = this.getTr(dataUser);

        this.tableE1.appendChild(tr);
       
        this.updateCount();
    }

    getTr(dataUser, tr = null){//'tr = null', significa que o parametro 'tr' não é obrigatorio
      
        if(tr === null) tr = document.createElement('tr');
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
        <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
        </td>
        </tr>
        `;
        this.addEventsTr(tr);
        return tr;
    }
    
    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", e => {
            if(confirm("Deseja realmente excluir?")){

                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                user.remove();
                tr.remove();
                this.updateCount();
            }
        });

        tr.querySelector(".btn-edit").addEventListener("click", e=>{
            console.log("tr -> ", JSON.parse(tr.dataset.user));

            let json = JSON.parse(tr.dataset.user);
            //let form = document.querySelector("#form-user-update");

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for(let name in json){
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_","")+"]");
                
                if(field){
                    
                    switch(field.type){
                        case 'file':
                            continue;
                         //   break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_","")+"][value="+json[name]+"]");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }

                }
            }

            this.formUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();
        //    document.querySelector("#box-user-create").style.display = "none";
        //   document.querySelector("#box-user-update").style.display = "block";
        });
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
