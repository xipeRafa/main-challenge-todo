const ID = document.getElementById.bind(document)

ID("all").addEventListener("click", ()=> {todoApp.filter()})
ID("remove").addEventListener("click", ()=> {todoApp.deleted()})
ID("active").addEventListener("click", ()=> {todoApp.filter('isActive', true)})
ID("completed").addEventListener("click", ()=> {todoApp.filter('isActive', false)})

const api = {
  data: [{"isActive": true,"content": "take out the trash"}],

  get: function() { return new Promise((resolve) => {setTimeout(() => { resolve(this.data)}, 500)}) },

  set: function() {
    let item = {'isActive': true,'content': event.target.value}
    this.data.push(item)
    return new Promise((resolve) => {setTimeout(() => {resolve(this.data)}, 200)})
  },

  toggle: function() {
    this.data.map(i => {if(i.content === event.target.innerText) {i.isActive = (!i.isActive)}})
    return new Promise((resolve) => { setTimeout(() => {resolve(this.data)}, 100)})
  },

  search: function(key, value) {
    return new Promise((resolve) => {
          typeof value === 'string' 
            ? search = api.data.filter(i => i[key].indexOf(value) > -1)
            : search = api.data.filter(i => i[key] === value)
          
          resolve(search)
    })
  },

  deleted: function() {
    let clean = this.data.filter(bool => { return bool.isActive === true})
    this.data = clean
    return new Promise((resolve) => {resolve(this.data)})
  }
  
}

 
class App {
  constructor(lists, left) {
    api.get().then(resolve => {
      this.data = resolve
      this.render()
    })
    this.lists = ID(lists)
    this.left = ID(left)
  }

  render() {
    let count = this.data.length,
      listItems = " "
    while (count--) {
      listItems += `
      <a class="panel-block ${( this.data[count].isActive ? '' : 'is-active' )}" onClick="todoApp.toggleState()">
        <span class="panel-icon">  <i class="fa fa-check"></i>  </span>
        ${this.data[count].content}
      </a>`
    }
    const list = `<div class="panel bg-w"></div>

      <input class="input-text" type="text" placeholder="New todo..." 
      onkeydown="javascript: if(event.keyCode == 13){todoApp.add(this.value); this.value='' }">

      <div class="list-tasks">${listItems}</div>`

    let completed = this.data.filter(i => i.isActive).length
    this.lists.innerHTML = list
    this.left.innerHTML = `<h3>Items Active: ${completed}</h3>`
  }

  add(item){ api.set(item).then(resolve => { this.data = resolve; this.render() } ) }

  toggleState(completed) { api.toggle().then(resolve => { this.data = resolve; this.render() } )
                           this.left.innerHTML = `<h3>Items Left: ${completed}</h3>`}

  filter(key, val) { key ? api.search(key, val).then(resolve => {this.data = resolve; this.render() })
                         : api.get().then(resolve => { this.data = resolve; this.render()}) }
  
  deleted(clean, completed) { api.deleted(clean).then(resolve => { this.data = resolve; this.render() })
                            this.left.innerHTML = `<h3>Items Left:${completed}</h3>`}
}

const todoApp = new App('lists', 'left') 
