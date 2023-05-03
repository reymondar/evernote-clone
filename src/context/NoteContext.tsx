import React, { ReactNode, SetStateAction, createContext, useContext, useReducer } from 'react'

type Note = {
    title:string,
    description:string,
    uid:string
}

const defaultNote: Note = { title: '' , description: '' , uid: ''}

export type Actions = 
    | {type: "TITLE" , payload: string}
    | {type: "DESCRIPTION" , payload: string}
    | {type: "NEW_NOTE" , payload: string}
    | {type: "CHANGE_NOTE" , payload: Note}
    | {type: "DELETE_NOTE" , payload: Note}


const reducer = (state: Note , action: Actions) => {
    switch(action.type) {
        case "TITLE":
           return { ...state, title: action.payload };
        case "DESCRIPTION":
            return { ...state, description: action.payload};
        case "NEW_NOTE":
            return {title:'' , description: '' , uid: action.payload};
        case "CHANGE_NOTE":
            return action.payload
        case "DELETE_NOTE":
        console.log('great, note deleted')
            return defaultNote
        default:
            return state
    }
}




const NoteConext = createContext(defaultNote)
const NoteContextManager = createContext<React.Dispatch<Actions> | null>(null)

const NoteProvider = ({children}: {children : ReactNode}) => {

    const [currentNote , noteManager] = useReducer(reducer, defaultNote)

  return (
    <NoteConext.Provider value={currentNote}>
        <NoteContextManager.Provider value={noteManager}>
            {children}
        </NoteContextManager.Provider>
    </NoteConext.Provider>
  )
}

export { NoteProvider , NoteConext , NoteContextManager } 