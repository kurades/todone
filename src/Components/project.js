import React from 'react'
import { useState } from 'react'
import data from '../Data/data'
import { TrashIcon, PencilIcon} from '@heroicons/react/outline'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
const Project = () => {
  const [projectData, updateData] = useState(data);
  const [toggleTask, changeToggleTask] = useState(false);
  const [toggleEdit, ChangeEditState] = useState("");
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
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps} snapshot={snapshot} className="min-h-[70px] flex flex-col flex-grow">
              {(column.id === 'col-1' && toggleTask === true) ?
                <>
                  <input className='border-2 p-1 my-1 outline-none' onKeyPress={onSubmitTask} />
                </>
                : <></>
              }
              {task.map((item, index) => { return <Task key={task.id} index={index} item={item} column={column.id}/> })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

    )
  }
  const onSubmitChange = (event)=>{
    if(event.key === 'Enter'){
      ChangeEditState("");
    }
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
            {(toggleEdit === item.id)?<input autoFocus onKeyPress={onSubmitChange} className='w-[228px] break-words' defaultValue={item.content}/>:<span className='w-[228px] break-words'>{item.content}</span>}
            
            <div className="cursor-pointer pl-2 text-gray-300   flex flex-col">
            <PencilIcon className='w-5 h-5 mb-1 hover:text-black duration-150' onClick={handleEdit(index,item.id,column)}/>
              <TrashIcon className='w-5 h-5 mt-1 hover:text-black duration-150' onClick={()=>handleDelete(index,item.id,column)}/>
            </div>
          </div>
        )}
      </Draggable>
    )
  }

  const handleEdit = (index,item,column) =>{
    ChangeEditState(item);
    const newState = {
      ...projectData,
    }
  }
  const handleDelete = (index,item,column)=>{
    // console.log(item,column);
    const newState = {
      ...projectData,
    }
    delete newState.task[item]
    newState.column[column].taskIds.splice(index,1);
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
          {projectData.columnOrder.map((colunmId) => {
            const column = projectData.column[colunmId];
            const task = column.taskIds.map(taskId => projectData.task[taskId])
            return <Column key={column.id} column={column} task={task} />
          })}
        </div>
      </DragDropContext>
    </div>
  )
}

export default Project