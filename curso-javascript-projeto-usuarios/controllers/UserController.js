class UserController{

    constructor(formId, tableId){
        this.formE1 = document.getElementById(formId);
        this.tableE1 = document.getElementById(tableId);
        this.onSubmit();
    }

    onSubmit(){
        this.formE1.addEventListener("submit", event => {
            event.preventDefault();//Cancela o comportamento padrão de um evento(no caso o submit)
           
           let btn = this.formE1.querySelector('[type=submit]');
           btn.disabled = true;
            let values = this.getValues();
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
        //A partir do ES2015, foi introduzido o operador Spread (essa reticencias)
       [...this.formE1.elements].forEach(function(field, index){
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
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
    }

    addLine(dataUser){
        console.log("dataUser", dataUser);

        let tr = document.createElement('tr');

        tr.innerHTML = `
        <tr>
        <td>
        <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
        </td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${(dataUser.admin)  ? 'Sim' : 'Não'}</td>
        <td>${dataUser.birth}</td>
        <td>
        <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
        </tr>
        `;
        this.tableE1.appendChild(tr);
    }

}