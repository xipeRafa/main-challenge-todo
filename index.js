      ID("all").addEventListener("click", ()=> { todoApp.filter() })
   ID("remove").addEventListener("click", ()=> { todoApp.cleanCompleted() })
   ID("active").addEventListener("click", ()=> { todoApp.filter('isActive', true) })
ID("completed").addEventListener("click", ()=> { todoApp.filter('isActive', false) })

const api = {

    data: [{"isActive": true,"content": "bbbbbbb"},{"isActive": false,"content": "aaaaaaa"}],

    get: function() { return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 160) }) },

    set: function() {
      this.data.unshift( {'isActive': true,'content': event.target.value} )
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 150) })
    },

    toggle: function() {
      this.data.map( i => {if(i.content === event.target.innerText){ i.isActive = (!i.isActive) }} )
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 100) } ) 
    },

    search: function(key, value) {
      return new Promise((resolve) => {
          typeof value === 'string' 
             ? search = this.data.filter(i => i[key].indexOf(value) > -1) 
             : search = this.data.filter(i => i[key] === value) 
          resolve(search)
      })
    },

    completed: function() {
      this.data = this.data.filter( i => { return i.isActive === true })
      return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 60) })
    }
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
          </a>`
      }
      const list = `
        <input  type="text" 
                class="input-text" 
                placeholder="New todo..." 
                onkeydown="javascript: if(event.keyCode == 13){todoApp.add(this.value); this.value = null }">

        <div class="list-tasks">${listItems}</div>`

      this.lists.innerHTML = list
      this.left.innerHTML = `<h3>Items Active: ${ this.data.filter(i => i.isActive).length }</h3>`
  }
    
    add(item){ api.set(item).then(resolve => { this.data = resolve; this.render() }) }

    toggleState() { api.toggle().then(resolve => { this.data = resolve; this.render() }) }

    filter(key, val) { key ? api.search(key, val).then(resolve => { this.data = resolve; this.render() })
                           : api.get().then(resolve => { this.data = resolve; this.render() }) }
  
    cleanCompleted() { api.completed().then(resolve => { this.data = resolve; this.render() }) }
}

const todoApp = new App('lists', 'left') 

/* .then(resolve => { this.data = resolve; this.render() })      update the info */
/* return new Promise((resolve) => { setTimeout(() => { resolve(this.data) }, 150) })       (get)  update the info */
