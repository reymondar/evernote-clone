import React , { useContext} from 'react'
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
  
  const { title , description , uid}: Note = useContext(NoteConext)
  
  const noteManager = useContext(NoteContextManager) as React.Dispatch<Actions>
  
  const { user , userLoggedIn } = useAuth()


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

  const handleChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    
    const target = e.target as HTMLTextAreaElement
    if(target.name === 'title') noteManager({ type: "TITLE" , payload: target.value})
    
    if(target.name === 'description') noteManager({ type: "DESCRIPTION" , payload: target.value})
  }


  const handleClick = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
   
    updateNotes(uid, title, description)
  }


  const handleNewNote = (e: React.SyntheticEvent<HTMLButtonElement>) => {  
    e.preventDefault()
    const newId = uuidv4()

    updateNotes(newId, '' , '')
    
    noteManager({type:"NEW_NOTE" , payload: newId})
  }
  
  const saveCondition = !userLoggedIn || uid === ''

  return (
    <div className='h-3/6 sm:h-full relative w-full flex-shrink-1'>
      <div className='flex flex-row sm:flex-col justify-between sm:h-24 p-3 bg-slate-50 border-b border-solid border-gray-200'>
        <button disabled={!userLoggedIn} onClick={handleNewNote}  className='px-4 py-2 bg-green-500 rounded-md w-44 place-self-center justify-self-center'>New Note</button>
      </div>
      <form className='h-full'>
        <div>
          <textarea rows={1} maxLength={50} className='w-full text-4xl rounded-sm px-8 box-border border-left  border-solid border-gray-500 resize-none shadow-none outline-none overflow-hidden' placeholder='Title' name='title' onChange={handleChange} value={title} />
          <textarea rows={19} maxLength={9000} className='w-full min-h-full text-lg rounded-sm px-8 box-border border-left  border-solid border-gray-500 resize-none shadow-none outline-none scrollbar-thin scrollbar-thumb-green-500  overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full' placeholder='Start writing right away' name='description' onChange={handleChange} value={description} />
        </div>
        <button disabled={saveCondition} className='w-full py-4 bg-green-600 rounded-md  text-white hover:cursor-pointer hover:bg-green-200  transition-all disabled:hidden' type='submit' onClick={handleClick}>SAVE</button>
      </form>
    </div>
  )
}

export default AddNote