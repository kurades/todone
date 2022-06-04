import React, { useEffect } from 'react'
import { useState } from 'react'
import data from '../Data/data'
import { TrashIcon, PencilIcon } from '@heroicons/react/outline'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId, databaseURL } from '../secret'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  databaseURL,
};


const Project = () => {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const [projectData, updateData] = useState();
  const [toggleTask, changeToggleTask] = useState(false);
  const [toggleEdit, ChangeEditState] = useState("");
  const [edit, setEdit] = useState("");
  // console.log(data);

  function writeUserData(userId, name, email, imageUrl) {
    set(ref(db, 'users/' + userId), {
      username: name,
      email: email,
      profile_picture: imageUrl
    });
  }

  useEffect(() => {
    const getProject = () => {
      get(child(ref(db), '/'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          updateData(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      })
    }
    getProject()
  }, [])


  const addTaskHandle = () => {
    changeToggleTask(!toggleTask);
  }
  const onSubmitTask = (event) => {
    if (event.key === "Enter") {
      const tId = "task-" + Date.now();
      const newState = {
        ...projectData,
        task: {
          ...projectData.task,
          [tId]: { id: tId, content: event.target.value },
        },
        column: {
          ...projectData.column,
          'col-1': {
            ...projectData.column['col-1'],
            taskIds: [...projectData.column['col-1'].taskIds, tId]
          }
        }
      }
      updateData(newState)
      return;
    }
  }
  const Column = ({ column, task }) => {
    return (
      <div className='border-2 w-72 mt-10 rounded-lg p-2 items-start'>
        <div className="flex justify-between">
          <h1 className="font-medium">{column.title}</h1>
          {(column.id === 'col-1') ? (<div className='select-none w-7 h-7 rounded-sm bg-slate-300 text-center text-white font-bold text-xl leading-6 duration-150 hover:bg-slate-400 hover:cursor-pointer' onClick={addTaskHandle}>+</div>) : (<></>)}
        </div>
        <Droppable droppableId={column.id} key={column.id} >
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps} snapshot={snapshot} className="min-h-[70px] flex flex-col flex-grow">
              {(column.id === 'col-1' && toggleTask === true) ?
                <>
                  <input autoFocus className='border-2 p-1 my-1 outline-none' onKeyPress={onSubmitTask} />
                </>
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
            className='border-2 p-1 my-1 flex justify-between items-center bg-white'
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {(toggleEdit === item.id) ? <input autoFocus /*onChange={(e)=>onChangeEdit(e)}*/ onKeyPress={(e) => onSubmitEdit(e, index, column, item.id)} className='w-[228px] break-words' defaultValue={item.content} /> : <span className='w-[228px] break-words'>{item.content}</span>}

            <div className="cursor-pointer pl-2 text-gray-300   flex flex-col">
              <PencilIcon className='w-5 h-5 mb-1 hover:text-black duration-150' onClick={() => handleEditButton(item.id)} />
              <TrashIcon className='w-5 h-5 mt-1 hover:text-black duration-150' onClick={() => handleDelete(index, item.id, column)} />
            </div>
          </div>
        )}
      </Draggable>
    )
  }
  const onSubmitEdit = (event, index, column, id) => {
    if (event.key === "Enter") {
      setEdit(event.target.value)
      const newState = {
        ...projectData,
        task: {
          ...projectData.task,
          [id]: {
            ...projectData.task[id],
            content: event.target.value,
          }
        }
      }
      ChangeEditState("")
      updateData(newState);
      console.log(newState);
    }
  }
  const handleEditButton = (item) => {
    ChangeEditState(item);
    console.log(toggleEdit);
  }
  const handleDelete = (index, item, column) => {
    // console.log(item,column);
    const newState = {
      ...projectData,
    }
    delete newState.task[item]
    newState.column[column].taskIds.splice(index, 1);
    updateData(newState)
  }
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
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      const newState = {
        ...projectData,
        column: {
          ...projectData.column,
          [newColumn.id]: newColumn,
        }
      }
      updateData(newState)
      console.log(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }
    const newState = {
      ...projectData,
      column: {
        ...projectData.column,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      }
    }
    updateData(newState)
  }
  return (
    <div className='mt-20 mr-10 ml-[270px]'>
      <h1 className="font-medium text-3xl">Projects</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-row justify-between items-start">
          {projectData && projectData.columnOrder.map((colunmId) => {
            const column = projectData.column[colunmId];
            if(!column.taskIds){column.taskIds = []}
            const task = column.taskIds.map(taskId => projectData.task[taskId])
            return <Column key={column.id} column={column} task={task} />
          })
          }
        </div>
      </DragDropContext>
    </div>
  )
}

export default Project