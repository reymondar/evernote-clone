import React , { useEffect , useState } from 'react'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { db } from '../pages/index'
import { UserCredential } from 'firebase/auth'
import { v4 as uuidv4 } from 'uuid'

type Note = {
  title: string ,
   description: string,
   uid: string
  }


type AddNoteProps = {
  user: UserCredential,
  actualNote: Note,
  setActualNote: (arg: Note) => void
}

const AddNote = ({user , actualNote , setActualNote }: AddNoteProps ) => {
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  useEffect(()=>{
    
    setTitle(actualNote.title)
    setDescription(actualNote.description)
    
  },[actualNote])

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
    
    e.preventDefault()
    
    const docRef = doc(db,'users', user.uid,'notes', actualNote.uid)

    setDoc(docRef, {title: title , description: description} , { merge: true})  
    .then((doc) => {
      console.log('Saved succesfully')
    })
    .catch(error => {
      alert('something happened, please try again')
    })


  }

  const handleNewNote = (e: React.SyntheticEvent<HTMLButtonElement>) => {  
    e.preventDefault()

   
    const newId = uuidv4()

    const docRef = doc(db,'users', user.uid,'notes', newId )

    setDoc(docRef, {title: title , description: description , uid: newId } , { merge: true})  
    .then((doc) => {
      console.log('Saved succesfully')
    }) 
    .catch(error => {
      alert('something happened, please try again')
    })

    setActualNote({title:'' ,description:'',uid:newId})
  }
  
  return (
    <div className='h-3/6 sm:h-full relative w-full flex-shrink-1'>
      <div className='flex flex-row sm:flex-col justify-between sm:h-24 p-3 bg-slate-50 border-b border-solid border-gray-200'>
        <button onClick={handleNewNote} className='px-4 py-2 bg-green-500 rounded-md w-44 place-self-center justify-self-center'>New Note</button>
      </div>
      <form className='h-full'>
        <div>
          <textarea rows={1} maxLength={50} className='w-full text-4xl rounded-sm px-8 box-border border-left  border-solid border-gray-500 resize-none shadow-none outline-none overflow-hidden' placeholder='Title' name='title' onChange={handleChange} value={title} />
          <textarea rows={23} maxLength={9000} className='w-full text-lg rounded-sm px-8 box-border border-left  border-solid border-gray-500 resize-none shadow-none outline-none' placeholder='Start writing right away' name='description' onChange={handleChange} value={description} />
        </div>
        <button className='w-full py-4 bg-green-600 rounded-md  text-white hover:cursor-pointer hover:bg-green-200  transition-all' type='submit' onClick={handleClick}>SAVE</button>
      </form>
    </div>
  )
}

export default AddNote