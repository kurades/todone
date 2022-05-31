const data = {
    task :{
        'task-1' : {id:'task-1',content:'Learn more'},
        'task-2' : {id:'task-2',content:'Make this project'},
        'task-3' : {id:'task-3',content:'Learn different framework'},
        'task-4' : {id:'task-4',content:'do sth'}, 
    },
    column :{
        'col-1' : {
            id : 'col-1',
            title : 'To-do',
            taskIds : ['task-1','task-3'],
        },
        'col-2' : {
            id : 'col-2',
            title : 'On-going',
            taskIds : ['task-2','task-4'],
        },
        'col-3' : {
            id : 'col-3',
            title : 'Complete',
            taskIds : [],
        },
    },
    columnOrder : ['col-1','col-2','col-3'],
}
export default data;