let toDoList = [
	{
  status: "notStarted",
  title: "Not Started",
  list: ["apples", "oranges", "bananas"]
  },
  {
  status: "inProgress",
  title: "In Progress",
  list: ["papaya", "kiwi", "mango"]
  },
  {
  status: "done",
  title: "Done",
  list: ["pomelo", "grapes", "watermelon"]
  }
]

var renderList = function() {
	document.getElementById('toDoList').innerHTML = toDoList.map(o => {
		return `<ul id="${o.status}"> <h3> ${o.status} </h3>
		${o.list.map( (v) => 
			`<li> 
				<p> ${v} </p> 
				${o.status != "done" ? `<button type="button" class="${o.status == "inProgress" ? "inProgress" : "notStarted"}"> ${o.status == "inProgress" ? "Done" : "Start"} </button>` : `<button type="button" class="notDone">Not Done</button>` }    
			</li>`).join('')}
		</ul>`;
	}).join('')
	document.getElementById('addNewItem').value = "";
} 
document.getElementById('MyList').addEventListener('click', e => {
	 if(e.target.tagName == "BUTTON") {
		var toDoItem = e.target.closest('li').querySelector('p').innerText;
		let index = toDoList.reduce( (r,v,k) => v.list.includes(toDoItem) ? r = k : r, null)
		toDoList = toDoList.reduce( (r,v,k) => {
			(k === index) ? v = {...v, list: v.list.filter(o => o !== toDoItem)} : v=v;
			(e.target.className === "notDone")  ?  k === index - 1 ? v = {...v, list: [toDoItem, ...v.list]} : v=v : k === index + 1 ?v = {...v, list: [toDoItem, ...v.list]} : v;							
			return [...r, v];
		}, [])			 
	 } 
	 if(e.target.className === 'allDone') {
		let allDone = [];
		allDone = toDoList.reduce( (r,v,k) => {		
			(v.status !== "done") && (r = [...r, ...v.list], v.list = []);		
			return r;
		}, [] );
	
		 toDoList = toDoList.reduce( (r,v,k) => {		
			v.status == "done" ? v = {...v, list: [...allDone, ...v.list]} : v= v;		
			return [...r, v];
		}, [] );

	 }
	 renderList()
})
document.getElementById('addNew').addEventListener('submit', e => {
	 	
	renderList()
})
//init
 renderList()


