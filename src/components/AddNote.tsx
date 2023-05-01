import React , { useEffect , useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../pages/index'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/hooks/useAuth'
type Note = {
  title: string ,
   description: string,
   uid: string
  }


type AddNoteProps = {
  actualNote: Note,
  setActualNote: (arg: Note) => void
}

const AddNote = ({ actualNote , setActualNote }: AddNoteProps ) => {
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  const { user , userLoggedIn } = useAuth()

  useEffect(()=>{
    
    setTitle(actualNote.title)
    setDescription(actualNote.description)
    
  },[actualNote])

  const updateNotes = (userId: string, noteId: string) => {

    const docRef = doc(db,'users', userId,'notes', noteId)

    setDoc(docRef, {title: title , description: description} , { merge: true})  
    .then((doc) => {
      console.log('Saved succesfully')
    })
    .catch(error => {
      alert('something happened, please try again')
    })
  }

  const handleChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    
    const target = e.target as HTMLTextAreaElement
    if(target.name === 'title') {
    setTitle(target.value)
    }
    if(target.name === 'description'){
      setDescription(target.value)
    }
  }


  const handleClick = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    console.log('it actually works')
    e.preventDefault()
    
    const userId = user?.uid as string

    updateNotes(userId, actualNote.uid)

  }

  const handleNewNote = (e: React.SyntheticEvent<HTMLButtonElement>) => {  
    console.log('it actually works')
    e.preventDefault()
    
    const userId = user?.uid as string

    const newId = uuidv4()

    updateNotes(userId, newId)

    setActualNote({title:'' ,description:'',uid:newId})
  }
  
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
        <button disabled={!userLoggedIn} className='w-full py-4 bg-green-600 rounded-md  text-white hover:cursor-pointer hover:bg-green-200  transition-all' type='submit' onClick={handleClick}>SAVE</button>
      </form>
    </div>
  )
}

export default AddNote