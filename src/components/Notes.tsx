import React, { SetStateAction, useEffect, useState } from 'react'
import { db } from '../pages/index'
import { onSnapshot, setDoc , doc , collection } from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth'


const Note = ({ index , handleIndex , name , title , description , uid , setNote }: { index:number , handleIndex: (p: number) => void , name: number , title: string , description: string , uid:number , setNote: React.Dispatch<SetStateAction<Note>> }) => {
  
  
  const handleNote = (e: React.SyntheticEvent<HTMLDivElement>) => {
    handleIndex(name)
    setNote({title: title, description: description, uid:uid})
  }
  return(
    <div onClick={handleNote} className={`${index === name? 'border border-solid border-blue-400' : ''} flex flex-col place-content-between justify-between w-60 sm:w-full h-full sm:h-60 p-4 mx-2 sm:mx-0 sm:my-4 lg:mb-8 bg-white rounded-lg shadow hover:cursor-pointer`}>
      <div>
        <h1 className='text-md font-bold'>{title}</h1>
        <h2 className='text-xs text-gray-500 py-2 overflow-hidden text-ellipsis max-w-full'>{description}</h2>
      </div>
      <p className='text-gray-500 text-xs w-24'>2 Minutes ago</p>
    </div>
  )
}

type Note = {
  title:string,
  description:string,
  uid: number
}


type Notes = Note[]



const Notes = ({setActualNote}: any) => {
  const [notes, setNotes] = useState<Notes | null>(null)
  const [noteIndex , setNoteIndex] = useState(0)

  const { user } = useAuth()
  console.log(user)

  useEffect(() => {
    console.log("use effect run")
    if(Object.keys(user).length > 0) {
    try{

    const collectionRef = collection(db,'users', user.uid,'notes')
      
    const unsuscribe = onSnapshot(collectionRef, (notes) =>{
      const dbNotes: Notes = []

      notes.docs.forEach((doc,i) =>{
        const note = doc.data() as Note
        
        dbNotes.push(note)
        console.log("doc:" + doc.id)

        setNotes(dbNotes)
        
      }
      )
     }
    )
    }
    catch(e){
      console.log(e)
    }
  }

  },[])


  
  const handleIndex = (i: number) => {
    setNoteIndex(i)
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
              index={noteIndex}
              handleIndex={handleIndex}
              name={i}
              title={note.title} 
              description={note.description} 
              uid={note.uid}
              setNote={setActualNote} />
          })}
          
      </div>
    </div>
  )
}


export default Notes