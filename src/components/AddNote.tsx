import React , { useContext, useState} from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../pages/index'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/hooks/useAuth'
import { Actions, NoteConext , NoteContextManager } from '@/context/NoteContext'


type Note = {
  title: string ,
   description: string,
   uid: string
  }


const AddNote = () => {
  
  //Desglose componentes de la nota 
  const { title , description , uid}: Note = useContext(NoteConext)
  
  const noteManager = useContext(NoteContextManager) as React.Dispatch<Actions>
  
  const { user , userLoggedIn } = useAuth()

  //Estado para cambiar el display de botones
  const [isSaved, setIsSaved] = useState(false)

  //Actualizamos la nota
  const updateNotes = ( noteId: string, title: string , description: string ) => {

    const userId = user?.uid as string

    const docRef = doc(db,'users', userId,'notes', noteId)
    
    setDoc(docRef, {title: title , description: description , uid: noteId} , { merge: true})  
    .then((doc) => {
      console.log('Saved succesfully')
    })
    .catch(error => {
      alert('something happened, please try again')
    })
  }

  //Enviamos los cambios al contexto
  const handleChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    
    setIsSaved(false)
    const target = e.target as HTMLTextAreaElement
    if(target.name === 'title') noteManager({ type: "TITLE" , payload: target.value})
    
    if(target.name === 'description') noteManager({ type: "DESCRIPTION" , payload: target.value})
  }

  
  const handleSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
   
    updateNotes(uid, title, description)

    setIsSaved(true)
  }


  //Creacion nueva nota 
  const handleNewNote = (e: React.SyntheticEvent<HTMLButtonElement>) => {  
    e.preventDefault()
    const newId = uuidv4()

    updateNotes(newId, '' , '')
    
    noteManager({type:"NEW_NOTE" , payload: newId})
  }
  

  return (
    <div className='h-3/6 sm:h-full relative w-full flex-shrink-1'>
      <div className='flex flex-row sm:flex-col justify-between sm:h-24 p-3 bg-slate-50 border-b border-solid border-gray-200'>
      {
        !isSaved ?
        <button 
              className='w-full py-4 bg-green-600 rounded-md  text-white hover:cursor-pointer hover:bg-green-200  transition-all disabled:hidden' 
              type='submit' 
              onClick={handleSave}>
              SAVE
        </button>
        :
        <button 
              className='w-full py-4 bg-green-600 rounded-md  text-white hover:cursor-pointer hover:bg-green-200  transition-all disabled:hidden'
              disabled={!userLoggedIn} 
              onClick={handleNewNote}>
              New Note
        </button>
      }
      </div>
      <form className='h-full'>
        <div>
          <textarea 
                    className='w-full text-4xl rounded-sm px-8 box-border border-left  border-solid border-gray-500 resize-none shadow-none outline-none overflow-hidden' 
                    rows={1} 
                    maxLength={50} 
                    placeholder='Title' 
                    name='title' 
                    onChange={handleChange} 
                    value={title} />
          <textarea 
                    className='w-full min-h-full text-lg rounded-sm px-8 box-border border-left  border-solid border-gray-500 resize-none shadow-none outline-none scrollbar-thin scrollbar-thumb-green-500  overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full' 
                    rows={17} 
                    maxLength={9000} 
                    placeholder='Start writing right away'
                    name='description' 
                    onChange={handleChange} 
                    value={description} />
        </div>
      </form>
    </div>
  )
}

export default AddNote