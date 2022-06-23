import React, { useEffect, useState, useRef } from 'react'
// import data from '../Data/data'
import { TrashIcon, PencilIcon } from '@heroicons/react/outline'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { App, auth } from '../firebase'
// Import the functions you need from the SDKs you need
import { getDatabase, ref, set, get, child, update, push } from "firebase/database";
import { useAuth } from './contexts/AuthContext'

const Project = () => {
  
  const { currentUser, logout } = useAuth()

  const db = getDatabase(App);
  const columnOrder = ["col-1", "col-2", "col-3"]
  const [projectData, setProjectData] = useState({
    column: {
      "col-1": {
        "id": "col-1",
        "title": "To-do",
      },
      "col-2": {
        "id": "col-2",
        "title": "On-going",
      },
      "col-3": {
        "id": "col-3",
        "title": "Complete"
      }
    },
  });
  const [toggleTask, setToggleTask] = useState(false);
  const [editItem, setEditItem] = useState("");
  const colorRef = useRef()
  const colorEditRef = useRef()

  function writeData(userId, name, email, imageUrl) {
    set(ref(db, 'users/' + userId), {
      username: name,
      email: email,
      profile_picture: imageUrl
    });
  }
  const getProject = () => {
    get(child(ref(db), `/${currentUser.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setProjectData(snapshot.val());
        } else {
          // alert("No data available");
          update(ref(db),{[currentUser.uid] : projectData})
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  useEffect(() => {
    getProject()
  }, [])

  const Column = ({ column, task }) => {
    return (
      <div className='border-2 w-72 mt-10 rounded-lg p-2 items-start'>
        <div className="flex justify-between">
          <h1 className="font-medium">{column.title}</h1>
          {(column.id === 'col-1') ? (<div className='select-none w-7 h-7 rounded-sm bg-slate-300 text-center text-white font-bold text-xl leading-6 duration-150 hover:bg-slate-400 hover:cursor-pointer' onClick={() => setToggleTask(!toggleTask)}>+</div>) : (<></>)}
        </div>
        <Droppable droppableId={column.id} key={column.id} >
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps} snapshot={snapshot} className="min-h-[70px] flex flex-col flex-grow">
              {(column.id === 'col-1' && toggleTask === true) ?
                <div className='flex'>
                  <input type="color" ref={colorRef} className='w-3 h-[45px] mr-1' name="" id="" />
                  <input autoFocus className='border-2 p-1 my-1 outline-none flex-1'
                    onKeyPress={onSubmitTask} />
                </div>
                : <></>
              }
              {task && task.map((item, index) => { return <Task key={task.id} index={index} item={item} column={column.id} /> })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

    )
  }


  const Task = ({ item, index, column }) => {
    return (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided) => (
          <div
            className='border-2 p-1 my-1 flex justify-between items-center bg-white rounded-sm'
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >

            {(editItem === item.id) ? <div className='flex w-full h-[50px]'>
              <input type="color" className='w-3 h-full' name="" id="" ref={colorEditRef} defaultValue={item.color} />
              <input autoFocus onKeyPress={(e) => onSubmitEdit(e, item.id)} className='flex-1 ml-2 break-words outline-none border-2' defaultValue={item.content} />
            </div> :
              <>
                <div className='w-2 h-10 rounded-md' style={{ backgroundColor: item.color }} />
                <span className='w-[228px] ml-2 break-words'>{item.content}</span>
                <div className="cursor-pointer pl-2 text-gray-300   flex flex-col">
                  <PencilIcon className='w-5 h-5 mb-1 hover:text-black duration-150' onClick={() => setEditItem(item.id)} />
                  <TrashIcon className='w-5 h-5 mt-1 hover:text-black duration-150' onClick={() => handleDelete(index, item.id, column)} />
                </div>
              </>}


          </div>
        )}
      </Draggable>
    )
  }

  // Task handle
  const onSubmitTask = (event) => {

    if (event.key === "Enter" && event.target.value) {
      const tId = Date.now().toString()
      const newTask = {
        id: tId,
        content: event.target.value,
        color: colorRef.current.value
      }
      const newState = {
        ...projectData,
        task: {
          ...projectData.task,
          [tId]: newTask,
        },
        column: {
          ...projectData.column,
          'col-1': {
            ...projectData.column['col-1'],
            taskIds: {...projectData.column['col-1'].taskIds, [tId]:true}
          }
        }
      }
      setProjectData(newState)
      const updates = {};
      updates[`/${currentUser.uid}/task/${tId}`] = newTask;
      updates[`/${currentUser.uid}/column/col-1/taskIds`] = {...projectData.column['col-1'].taskIds,[tId] : true};
      update(ref(db), updates)

      return;
    }
  }

  const onSubmitEdit = (event, id) => {
    if (event.key === "Enter") {
      const newState = {
        ...projectData,
        task: {
          ...projectData.task,
          [id]: {
            ...projectData.task[id],
            content: event.target.value,
            color : colorEditRef.current.value,
          }
        }
      }
      setEditItem("")
      setProjectData(newState);
      update(child(ref(db),`${currentUser.uid}/task/${id}`), {
        id : id,
        content: event.target.value,
        color : colorEditRef.current.value,
      })
    }
  }

  const handleDelete = (index, item, column) => {
    const newState = {
      ...projectData,
    }
    delete newState.task[item]
    delete newState.column[column].taskIds[item]
    const updates = {}
    updates[`/${currentUser.uid}/task/${item}`] = null;
    updates[`/${currentUser.uid}/column/${column}/taskIds`] = {...projectData.column[column].taskIds,[item] : null};
    update(ref(db),updates)
    setProjectData(newState)
  }

  // Drag n Drop handle
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    } 
    if (destination.droppableId === source.droppableId &&
      destination.index === source.index) {
      return;
    }
    const start = projectData.column[source.droppableId]
    const finish = projectData.column[destination.droppableId]
    if (start === finish) {
      const taskIds = {}
      const arrayIds = Object.keys(start.taskIds)
      arrayIds.splice(source.index, 1)
      arrayIds.splice(destination.index, 0, draggableId)
      arrayIds.forEach(function(key){
        taskIds[key] = start.taskIds[key]
      })
      const newColumn = {
        ...start,
        taskIds: taskIds,
      }
      
      const newState = {
        ...projectData,
        column: {
          ...projectData.column,
          [newColumn.id]: newColumn,
        }
      }
      const updates = {}
      updates[`/${currentUser.uid}/column/${destination.droppableId}`] = {...projectData.column[destination.droppableId], taskIds};
      update(ref(db),updates)
      setProjectData(newState)
      return;
    }

    const taskIdsStart = {}
    const startTaskIds = Object.keys(start.taskIds)
    startTaskIds.splice(source.index, 1)
    startTaskIds.forEach(function(key){
      taskIdsStart[key] = start.taskIds[key]
    })
    const newStart = {
      ...start,
      taskIds: taskIdsStart
    }

    const taskIdsFinish = {}
    const finishTaskIds = Object.keys(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    finishTaskIds.forEach(function(key){
      taskIdsFinish[key] = finish.taskIds[key]
      taskIdsFinish[key] = true
    })
    const newFinish = {
      ...finish,
      taskIds: taskIdsFinish,
    }

    const newState = {
      ...projectData,
      column: {
        ...projectData.column,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      }
    }

    const updates = {}
    updates[`/${currentUser.uid}/column/${source.droppableId}`] = {...projectData.column[source.droppableId], taskIds : taskIdsStart};
    updates[`/${currentUser.uid}/column/${destination.droppableId}`] = {...projectData.column[destination.droppableId], taskIds : taskIdsFinish};
    console.log(updates);
    update(ref(db),updates)
    setProjectData(newState)
  }


  return (
    <div className='mt-20 mr-10 ml-[10px]'>
      <h1 className="font-medium text-3xl">Projects</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-row justify-between items-start max-w-[1400px] m-auto">
          {projectData && columnOrder.map((colunmId) => {
            const column = projectData.column[colunmId];
            if (column.taskIds === undefined) { projectData.column[colunmId].taskIds = [] }
            const task = Object.keys(column.taskIds).map((key, value) => projectData.task[key])
            return <Column key={column.id} column={column} task={task} />
          })
          }
        </div>
      </DragDropContext>
    </div>
  )
}

export default Project