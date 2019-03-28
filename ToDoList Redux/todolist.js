
const {createStore} = Redux;

const reducer  = (state, {type,payload}) => {
    if(type === "FetchData") {
        return {...state, "data": [...state.data, ...payload], "filteredData": [...state.filteredData, ...payload]}
    }

    if(type === "AddNewItem") {
        return {...state, "data": [...payload], "filteredData": [...payload]}
    }

    if(type === "MoveTo") {
    
        return {...state,  "data": [...payload]}
    }

    if(type === "SearchData") {
        return {...state, "filteredData": [ ...payload]}
    }

    if(type === "ResetData") {
        return {...state, "filteredData": [ ...payload]}
    }
    if(type === "EditElement") {
        return {...state, "data": [...payload], "filteredData": [...payload]}
    }
    return state;
 }

 const state = {
     "data": [],
     "filteredData": []
 }


 const store = createStore(reducer, state, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

 const getData = () => {
     axios.get("/data.json").then(r => {
         store.dispatch({type: "FetchData", payload: r.data })
     })
 }
 store.subscribe(() => {
    console.log("store changed to:  ", store.getState());

    renderList(store.getState().filteredData)
  });
const updateFilteredData = (v) => {
    let state = store.getState().data;

}
 const moveTo = (index, direction, element) => {
    let tempState = store.getState().data;
    tempState[index].list = tempState[index].list.filter(v => v !== element);
    tempState[direction].list = [...tempState[direction].list, element];


    store.dispatch({type: "MoveTo", payload:tempState})

    var searchVal = document.getElementById('SearchList').value;
    searchList(searchVal)

    
 }

 const searchList = (value) => {
    let tempState = store.getState().data;    

    tempState = tempState.reduce((r,v,k) => {
        let condition = v.list.filter(v2 => v2.includes(value)).length > 0;
        if (condition) {
            r = [...r,{...v,"list": v.list.filter(v2 => v2.includes(value))}];
        } else {
            r = [...r,{...v,"list": []}];
        }

        return r;
    },[])
    store.dispatch({type: "SearchData", payload: tempState})   
 }

 const renderList = (data) => {
    let error = !(data.reduce((r,v,k) => {
        return v.list.length > 0 ? [...r,true] : [...r,false];
    },[])).includes(true);

    document.getElementById('toDoList').innerHTML = `
    ${data.map((o, i) => {
        let output = "";
        if(o.list.length > 0) {
            output +=  `<ul id="${o.status}"> <h3> ${o.status} </h3>
		${o.list.map( (v) => {
            return `<li> 
                <div class="readonly"><p>${v}</p><i class="fa fa-edit"></i></div>
                <div class="editable hidden"><input type="text" value="${v}"> <i class="fa fa-save" data-value="${v}"></i></div>
				${o.status != "done" ? `<button type="button" class="${o.status == "inProgress" ? "inProgress" : "notStarted"}" data-index="${i}" data-item="${v}"> ${o.status == "inProgress" ? "Done" : "Start"} </button>` : `<button type="button" class="done" data-index="${i}" data-item="${v}">Not Done</button>` }    
			</li>`}).join('')} 
        </ul>`;
        }		

        return output;
    }).join('')}

    <div class="${error ? "" : "hidden"}">No items found</div>
    `
    document.getElementById('addNewItem').value = "";
 
} 

const editItems = (oldItem, newItem) => {
    let tempState = store.getState().filteredData;
            tempState = tempState.reduce((r,v,k) => {
               if (v.list.indexOf(oldItem) > -1) {
                    let index = v.list.reduce((z,o,t) => {
                        o == oldItem ? z = t : z;
                        return z;
                    }, null)
                    
                    v.list[index] = newItem;
               }
                             
                return [...r, v];
            }, [])
    
            store.dispatch({type: "EditElement", payload: tempState})
}
//EVENTS
document.querySelector('#toDoList').addEventListener('click', e => {

    if(e.target.tagName === "BUTTON") {
        let elem = e.target.getAttribute('data-item');
        let elemIndex = parseFloat(e.target.getAttribute('data-index'));
        let direction = e.target.classList.contains('done') ? elemIndex-1: elemIndex+1;

        moveTo(elemIndex, direction, elem);     
        
    }      
    var oldItem = "";
    var newItem = "";
    if(e.target.tagName === "I"){
        if(e.target.classList.contains("fa-edit")){
            e.target.closest('li').querySelector('.readonly').classList.add('hidden');
            e.target.closest('li').querySelector('.editable').classList.remove('hidden');           
        }

        if(e.target.classList.contains("fa-save")){
            e.target.closest('li').querySelector('.readonly').classList.remove('hidden');
            e.target.closest('li').querySelector('.editable').classList.add('hidden');
            oldItem = e.target.getAttribute('data-value')
            newItem = e.target.parentNode.querySelector('input').value;
            
            editItems(oldItem, newItem)
        }
    }          
    
})


document.getElementById('SearchList').addEventListener('keyup', e => {
    let value = e.target.value;
    if(value.length > 2) {
        searchList(value)
    } else {
        if(e.keyCode === 8) {
            store.dispatch({type: "ResetData", payload: store.getState().data})
        }        
    }
    
})

document.getElementById('MyList').addEventListener('submit', e=> {
    e.preventDefault()

    let newItem = document.getElementById('addNewItem').value;

    let tempState = store.getState().filteredData;
    tempState = tempState.reduce((r,v,k) => {
        if(v.status == "notStarted") {
            v = {...v, "list": [...v.list, newItem]}
        }
    return [...r, v]
    }, [])
    store.dispatch({type: "AddNewItem", payload: tempState})
    
})
getData();

