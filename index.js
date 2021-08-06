      ID("all").addEventListener("click", ()=> { todoApp.filter() })
   ID("remove").addEventListener("click", ()=> { todoApp.cleanCompleted() })
   ID("active").addEventListener("click", ()=> { todoApp.filter('isActive', true) })
ID("completed").addEventListener("click", ()=> { todoApp.filter('isActive', false) })


const api = {

    data: [{'id': Date.now(),"isActive": true,"content": "aaaaaa"},
           {'id': Date.now()+1,"isActive": false,"content": "bbbbbb"},
           {'id': Date.now()+2,"isActive": false,"content": "cccccc"} ],

    get: function() { return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 160) }) },

    set: function() {
      this.data.push({'id': Date.now(),'isActive': true,'content': event.target.value} )
      return new Promise((resolve) => { console.log('data:', this.data), setTimeout(() => { resolve(this.data) }, 150) })
    },

    toggle: function() {
      this.data.map( el => {if(el.content === event.target.innerText){ el.isActive = (!el.isActive) }} )
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 100) } ) 
    },

    search: function(key, value) {
      return new Promise((resolve) => {
          typeof value === 'string' // or boolean
             ? search = this.data.filter(el => el[key].indexOf(value) > -1)  
             : search = this.data.filter(el => el[key] === value) 
          resolve(search)
      })
    },

    completed: function() {
      this.data = this.data.filter( el => { return el.isActive === true })
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 60) })
    },

    edited: function(){
      /*let txt = event.target.previousElementSibling.previousElementSibling.id = Date.now() set id when clicked */ 
      let dis = document.getElementsByClassName("disabled")
      for (const el of dis) {
        el.setAttribute("disabled", "true");
      /*   el.style.backgroundColor='lightgray';
        el.style.color='gray'; */
        el.style.cursor='none'
      }

    /*   let x = document.getElementsByClassName("disabled");
      for (let i=0; i<x.length; i++) {
      x[i].style.color = "blue"; 
    }*/


      let btnEdit = event.target

      let txt  = btnEdit.previousElementSibling.previousElementSibling.innerText //get text of element clicked 

      let idElementClicked = this.data.find(el => el.content === txt).id // find id of element with text gotted clicking
        console.log('id of element clicked:', idElementClicked) 

      ID('textId').value = txt // move the text to input text
      ID('textId').style.border='2px solid lightblue'
      ID('textId').focus()
      let ind = this.data.findIndex(el => el.id === idElementClicked)
        console.log('index of Element clicked:', ind)

      this.data.splice(ind,1)   
       
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 100000) })   
    
    },

    deleted: function(){
      let txt = event.target.previousElementSibling.innerText 
      let ind = this.data.findIndex(el => el.content === txt)
      this.data.splice(ind,1)
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 10) } )  
    }
}



class App {
  constructor(lists, left) {
    api.get().then(resolve => { this.data = resolve; this.render() }) 
    this.lists = ID(lists)
    this.left = ID(left) 
  }

  render() {
      let count = this.data.length //index
      let listItems = " "
      while (count--) {
        listItems += `
          <a class="panel-block disabled ${( this.data[count].isActive ? '' : 'is-active' )}" onClick="todoApp.toggle()">
            <span class="panel-icon">  <i class="fa fa-check"></i>  </span>  ${this.data[count].content}
          </a> 
          <button class="delet disabled" onClick="todoApp.delet()">Delete</button>
          <button class="edit disabled"  onClick="todoApp.edit()">Edit</button> 
        `
      }  
      const list = `
        <input  type="text" 
                class="input-text" 
                placeholder="New todo..." 
                id='textId'
                onkeydown="javascript: if(event.keyCode == 13){todoApp.add(this.value); this.value = null }">

        <div class="list-tasks">${listItems}</div>`

      this.lists.innerHTML = list
      this.left.innerHTML = `<h3>Items Active: ${ this.data.filter(i => i.isActive).length }</h3>`
  }
    
    add(value){  
                let rep = this.data.map(el => el.content).includes(value)

                    rep === true
                      ? alert('are you repeating the note?')
                      : api.set(value).then(resolve => { this.data = resolve; this.render() }) 
    }

    toggle() { api.toggle().then(resolve => { this.data = resolve; this.render() }) }

    filter(key, val) { key ? api.search(key, val).then(resolve => { this.data = resolve; this.render() })
                           : api.get().then(resolve => { this.data = resolve; this.render() }) } // All
  
    cleanCompleted() { api.completed().then(resolve => { this.data = resolve; this.render() }) }

    delet(){ api.deleted().then(resolve => { this.data = resolve; this.render() }) }
    
    edit(){ api.edited().then(resolve => { this.data = resolve; this.render() }) }

}

const todoApp = new App('lists', 'left') 





-------------------------------------------------------------------------------
      
      
      
      const mascotaInput = document.querySelector('#mascota');
const contenedorCitas = document.querySelector('#citas');
const formulario = document.querySelector('#nueva-cita')

formulario.addEventListener('submit', nuevaCita); //82

let editando = false;

const citaObj = {
    mascota: '',
}

eventListeners();
function eventListeners() { mascotaInput.addEventListener('change', datosCita) }
function datosCita(e) { citaObj[e.target.name] = e.target.value; console.log(e.target.name)}

class Citas {
    constructor() {
        this.citas = []
    }

    agregarCita(cita) { this.citas = [...this.citas, cita] }

    editarCita(update) { this.citas = this.citas.map( cita => cita.id === update.id ? update : cita)}

    eliminarCita(id) { this.citas = this.citas.filter( cita => cita.id !== id) }
}


class UI {

    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        divMensaje.textContent = mensaje;

        tipo === 'error' ? divMensaje.classList.add('alert-danger') : divMensaje.classList.add('alert-success')

        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.agregar-cita'));

        setTimeout( () => { divMensaje.remove()}, 3000)
    }

   imprimirCitas({citas}) { // Se puede aplicar destructuring desde la función...
       
        this.limpiarHTML();

        citas.forEach(cita => {
            const {mascota, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.innerHTML = `${mascota}`;

            const btnEliminar = document.createElement('button');
            btnEliminar.onclick = () => eliminarCita(id); // 108
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar'

            const btnEditar = document.createElement('button');
            btnEditar.onclick = () => cargarEdicion(cita); //113
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar'

            divCita.appendChild(mascotaParrafo)
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)

            contenedorCitas.appendChild(divCita);
        })  
   }

   limpiarHTML() { while(contenedorCitas.firstChild) { contenedorCitas.removeChild(contenedorCitas.firstChild) } }
}

const ui = new UI();

const instCitas = new Citas();

function nuevaCita(e) {
    e.preventDefault();

    const {mascota} = citaObj;

    if( mascota === '' ) { return ui.imprimirAlerta('Todos los mensajes son Obligatorios', 'error') }

    if(editando) {
        instCitas.editarCita( {...citaObj} );
        ui.imprimirAlerta('Guardado Correctamente');
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        editando = false;
    } else {
        citaObj.id = Date.now();
        instCitas.agregarCita({...citaObj});
        ui.imprimirAlerta('Se agregó correctamente')
    }

    ui.imprimirCitas(instCitas);
    reiniciarObjeto() //107
    formulario.reset();
}

function reiniciarObjeto() { citaObj.mascota = '' }

function eliminarCita(id) {
    instCitas.eliminarCita(id);
    ui.imprimirCitas(instCitas)
}

function cargarEdicion(cita) {
    const {mascota, id } = cita;
    citaObj.mascota = mascota;
    citaObj.id = id;
    mascotaInput.value = mascota;
    mascotaInput.focus()
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}

