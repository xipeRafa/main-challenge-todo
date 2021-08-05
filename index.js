      ID("all").addEventListener("click", ()=> { todoApp.filter() })
   ID("remove").addEventListener("click", ()=> { todoApp.cleanCompleted() })
   ID("active").addEventListener("click", ()=> { todoApp.filter('isActive', true) })
ID("completed").addEventListener("click", ()=> { todoApp.filter('isActive', false) })


const api = {

    data: [{"isActive": true,"content": "bbbbbbb"},{"isActive": false,"content": "aaaaaaa"}],

    get: function() { return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 160) }) },

    set: function() {
      this.data.unshift({'isActive': true,'content': event.target.value} )
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 150) })
    },

    toggle: function() {
      this.data.map( el => {if(el.content === event.target.innerText){ el.isActive = (!el.isActive) }} )
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 100) } ) 
    },

    search: function(key, value) {
      return new Promise((resolve) => {
          typeof value === 'string' // or boolean
             ? search = this.data.filter(el => el[key].indexOf(value) > -1, console.log('string'))  
             : search = this.data.filter(el => el[key] === value, console.log('boolean')) 
          resolve(search)
      })
    },

    completed: function() {
      this.data = this.data.filter( el => { return el.isActive === true })
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 60) })
    },

    edited: function(){
      let txt = event.target.previousElementSibling.previousElementSibling.innerText
      ID('textId').value = txt
      let ind = this.data.findIndex(el => el.content === txt)
      this.data.splice(ind,1)  
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 100000) })  
    },

    deleted: function(){
      let txt = event.target.previousElementSibling.innerText 
      let ind = this.data.findIndex(el => el.content === txt)
      this.data.splice(ind,1)
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 10) } )  
    },
}


class App {
  constructor(lists, left) {
    api.get().then(resolve => { this.data = resolve; this.render() }) 
    this.lists = ID(lists)
    this.left = ID(left) 
  }

  render() {
      let count = this.data.length
      let listItems = " "
      while (count--) {
        listItems += `
          <a class="panel-block ${( this.data[count].isActive ? '' : 'is-active' )}" onClick="todoApp.toggleState()">
            <span class="panel-icon">  <i class="fa fa-check"></i>  </span> ${this.data[count].content}
          </a> 
          <div class="delet" onClick="todoApp.delet()">Delete</div>
          <div class="edit" id='edit' onClick="todoApp.edit()">Edit</div> 
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
    
    add(value){ api.set(value).then(resolve => { this.data = resolve; this.render() }) }

    toggleState() { api.toggle().then(resolve => { this.data = resolve; this.render() }) }

    filter(key, val) { key ? api.search(key, val).then(resolve => { this.data = resolve; this.render() })
                           : api.get().then(resolve => { this.data = resolve; this.render() }) } // All
  
    cleanCompleted() { api.completed().then(resolve => { this.data = resolve; this.render() }) }

    delet(){ api.deleted().then(resolve => { this.data = resolve; this.render() }) }
    
    edit(){ api.edited().then(resolve => { this.data = resolve; this.render() }) }

}

const todoApp = new App('lists', 'left') 


