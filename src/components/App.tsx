import React , { useState }from 'react'
import { getAuth , GoogleAuthProvider , signInWithPopup , signOut } from 'firebase/auth'
import AddNote from './AddNote'
import Notes from './Notes'
import { useAuth } from '@/hooks/useAuth'
import { NoteProvider } from '@/context/NoteContext'

const googleProvider = new GoogleAuthProvider()

const App = () => {
  const { userLoggedIn } = useAuth() 
  
  const handleLogin = () => {
    
    const auth = getAuth()

   signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)
         
      }).catch((error) => {
        const errorCode = error.code

        const errorMessage = error.message

        const credential = GoogleAuthProvider.credentialFromError(error)

        console.log(credential)
      })
  }

  const handleLogout = () => {
    const auth = getAuth()

    signOut(auth)
    .then((e)=>{
      alert('logged out')
      //setUserLogged(false)
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  return (
    <> 
    
        <div className='flex justify-center'>
          {userLoggedIn ?        
          <button className='text-2xl p-4 border border-solid border-gray-400 rounded-md' onClick={handleLogout}>Logout</button>
          :
          <button className='text-2xl p-4 border border-solid border-gray-400 rounded-md' onClick={handleLogin}>Login with Google</button>
          } 
        </div>
        <p>holi</p>
        <NoteProvider>
          <div className='flex flex-col sm:flex-row justify-between sm:justify-center w-full h-5/6 sm:px-24'>
            <Notes />
            <AddNote />
          </div>
        </NoteProvider>
    </>
  )
}


export default App