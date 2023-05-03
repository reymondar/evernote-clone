import React, { SetStateAction, useEffect, useState , useContext } from 'react'
import { db } from '../pages/index'
import { doc , onSnapshot , collection, deleteDoc } from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth'
import { FaTrash } from 'react-icons/fa'
import { Actions , NoteConext, NoteContextManager } from '@/context/NoteContext'
type Note = {
  title:string,
  description:string,
  uid: string
}

type Notes = Note[]

type NotesProps = {
  actualNote: Note,
  setActualNote: React.Dispatch<SetStateAction<Note>>
} 

const emptyNote = {
  title:'',
  description:'',
  uid:''
}

const Note = ({ title , description , uid , deleteNote }: { title: string , description: string , uid: string , deleteNote: (arg: string) => void }) => {
  
  const currentNote = useContext(NoteConext)
  const noteManager = useContext(NoteContextManager) as React.Dispatch<Actions>

  const handleNote = () => noteManager( {type:"CHANGE_NOTE" , payload:{title: title, description: description, uid:uid}} )

  const handleDelete = () => {
    deleteNote(uid)
    //deletion
    noteManager({type: "CHANGE_NOTE", payload: emptyNote})

  }
  return(
    <div onClick={handleNote} className={`${currentNote.uid === uid ? 'border border-solid border-blue-400' : ''} relative flex flex-col place-content-between justify-between w-60 sm:w-full h-full sm:h-60 p-4 mx-2 sm:mx-0 sm:my-4 lg:mb-8 bg-white rounded-lg shadow hover:cursor-pointer md:overflow-hidden`}>
      <div>
        <h1 className='text-md font-bold'>{title}</h1>
        <h2 className='text-xs text-gray-500 py-2 overflow-hidden text-ellipsis max-w-full'>{description}</h2>
      </div>
      <p className='text-gray-500 text-xs w-24 md:pr-8 lg:pr-0'>2 Minutes ago</p>
      <FaTrash onClick={handleDelete} className={`absolute bottom-3 md:bottom-5 lg:bottom-3a right-2 opacity-0 ${currentNote.uid === uid ? 'opacity-100' : ''} transition-all text-gray-300 md:text-lg hover:text-gray-500`}/>
    </div>
  )
}
 

const Notes = () => {
  const [notes, setNotes] = useState<Notes | null>(null)

  const noteManager = useContext(NoteContextManager) as React.Dispatch<Actions>

  const { user , userLoggedIn} = useAuth()
 
  useEffect(() => {
    
    try {
    const userId = user?.uid as string
    const collectionRef = collection(db,'users', userId,'notes')
      
    const unsuscribe = onSnapshot(collectionRef, (notes) =>{
      const dbNotes: Notes = []

      notes.docs.forEach((doc,i) =>{
        const note = doc.data() as Note        
  
        dbNotes.push(note)

        setNotes(dbNotes)       
      }
      )
     }
    )
  }
  catch(error) {
    console.log(error)
  }
  },[user])


  useEffect(()=>{
    if(!userLoggedIn) {
      setNotes(null)
      //Actually it's not a note deletion, but this action serves the purpose of emptying our note Object
      noteManager({type: "CHANGE_NOTE", payload: emptyNote})
    }
   
  },[userLoggedIn])

  
  const deleteNote = (noteId: string) => {
    const userId = user?.uid as string
    const docRef = doc(db, 'users' , userId , 'notes' , noteId)
    
    deleteDoc(docRef)
    
    if(notes?.length === 1) setNotes(null)
  }

  return(
    <div className='w-full sm:w-2/6 h-60 sm:h-full border-box bg-gray-100 overflow-hidden flex-shrink-1'>
      <div className='flex flex-row sm:flex-col justify-between sm:h-24 p-3 border-b border-solid border-gray-200'>
        <h1 className='text-xl font-semibold'>All Notes</h1>
        <p className='text-sm text-gray-500'>{notes ? notes.length : '0' } notes</p>
      </div>
      <div className='flex sm:block w-full h-44 sm:h-full p-3 overflow-x-scroll overflow-y-hidden sm:overflow-y-scroll scrollbar-hide'>
          {notes && notes.map((note,i) => {
              return <Note 
              key={i} 
              title={note.title} 
              description={note.description}
              uid={note.uid} 
              deleteNote={deleteNote} />
          })}
          
      </div>
    </div>
  )
}


export default Notes