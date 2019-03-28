var demo = new Vue({
    el: '#MyList',
  
    data: {
      titleaddNew: 'Add a new item to the list',
      toDoList: [{
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
      ],
      newItem: ""
    },
    methods: {
      changeList: function(e, item, index) {
            this.toDoList = this.toDoList.reduce((r, v, k) => {
            (k === index) ? v = { ...v,
              list: v.list.filter(o => o !== item)
            }: v = v;
            (e.target.className === "done") ? k === index - 1 ? v = { ...v,
              list: [item, ...v.list]
            } : v = v: k === index + 1 ? v = { ...v,
              list: [item, ...v.list]
            } : v;
            return [...r, v];
          }, [])     
        
      },
      checkAll: function(e) {
        let allDone = [];
          allDone = this.toDoList.reduce((r, v, k) => {
            (v.status !== "done") && (r = [...r, ...v.list], v.list = []);
            return r;
          }, []);
  
          this.toDoList = this.toDoList.reduce((r, v, k) => {
            v.status == "done" ? v = { ...v,
              list: [...allDone, ...v.list]
            } : v = v;
            return [...r, v];
          }, []);
      },
      addItem: function(e, value) {
        e.preventDefault();
        this.toDoList = this.toDoList.reduce((r, v, k) => {
          (v.status == "notStarted") ? v = { ...v,
            list: [value, ...v.list]
          }: v = v;
          return [...r, v];
        }, [])
      }
    }
  });
