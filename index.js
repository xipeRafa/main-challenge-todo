

const api = {
      data : [{ "isActive": true,"content": "take out the trash"}],
      
      get: function () {
       return new Promise((resolve) => {
        setTimeout(() => {
          console.log('data-get', this.data)
          resolve(this.data)
        }, 500)
      })
     },
    
     set: function () {
        let item ={'isActive': true,'content': event.target.value}
        this.data.push(item)
        return new Promise((resolve) => {
           setTimeout(() => {
             console.log('data-set', this.data)
             resolve(this.data)
        }, 200)
      })
     },
    
     toggle: function () {
       this.data.map( i => {
         if( i.content === event.target.innerText ) {
               i.isActive = (!i.isActive)
           }
        })
          return new Promise((resolve) => {
            setTimeout(() => {
              console.log('data-toggle', this.data)
              resolve(this.data)
            }, 100)
         })
      },
    
     search: function (key, value) {
        return new Promise((resolve) => {
          setTimeout(() => {
            let search 
            if ( typeof value === 'string') {
              search = api.data.filter(i => i[key].indexOf(value) > -1 )
            } else {
              search = api.data.filter(i => i[key] === value )
            }
            resolve(search)
          }, 50)
        })
      },
    
      delete: function () {
        let clean = this.data.filter( bool => {
          return bool.isActive === true;
        })
        
        this.data = clean
        return new Promise((resolve) => {
           
             console.log('data-delete', this.data)
             resolve(this.data)
        })
     },
    
    }
    
    const all = document.getElementById("all");
    all.addEventListener("click", function(){todoApp.filter()})
    
    const completed = document.getElementById("completed");
    completed.addEventListener("click", function(){todoApp.filter('isActive', false)})
    
    const active = document.getElementById("active");
    active.addEventListener("click", function(){todoApp.filter('isActive', true)})
    
    const remove = document.getElementById("remove");
    remove.addEventListener("click", function(){todoApp.delete()}) 
    
    
    class App {
      constructor(lists, left) {
        api.get().then( resolve => { 
          this.data = resolve 
          this.render()
       })
        this.lists = document.getElementById(lists)
        this.left = document.getElementById(left)
      }
        
      render () {
        let count = this.data.length, listItems = " ";
        while (count--){
          
         listItems += `<a 
                          class="panel-block ${( this.data[count].isActive ? '' : 'is-active' )}" 
                          onClick="todoApp.toggleState()">
    
                          <span class="panel-icon">
                              <i class="fa fa-check"></i>
                          </span>
    
                          ${this.data[count].content}
                       </a>`
        }
    
        const list = `
                      <input class="input-text" type="text"
                               placeholder="O Create a new todo..." 
             
                               onkeydown="javascript: if(event.keyCode == 13){
                                    todoApp.add(this.value); 
                                    this.value='';
                               }">

                       <div class="list-tasks">
                           ${listItems}
                       </div>
                      
                      
                      
                      `
    
          let completed = this.data.filter(i => i.isActive).length;
          console.log('length',completed)
    
          
          this.lists.innerHTML = list
          this.left.innerHTML = `<h3>Items Active: ${completed}</h3>`  
         
      }
    
    
    
      add(item){
        api.set(item).then( resolve => {
          this.data = resolve
          this.render()  
        })
      }
    
      toggleState(completed) {
        api.toggle().then( resolve => {
        this.data = resolve
        this.render()
        
       })
        this.left.innerHTML = `<h3>Items Left: ${completed}</h3>` 
      }
     
      filter(key, val) {
        if (key) {
          api.search(key, val).then( resolve => {
            this.data = resolve
            this.render()
          })
        } else {  //All
          api.get().then( resolve => {
            this.data = resolve
            this.render()
          })
        }
      }
      
      delete(clean,completed){
        api.delete(clean).then( resolve => {
          this.data = resolve
          this.render()  
        }) 
        this.left.innerHTML = `<h3>Items Left: ${completed}</h3>` 
      }
    }
    
    
    const todoApp = new App('lists', 'left')
    
    
    
    
    
    
    
