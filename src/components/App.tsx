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
          <button className='shadow-md m-3 p-4 font-semibold rounded-md text-sm' onClick={handleLogout}>LOGOUT</button>
          :
          <button className='shadow-md m-3 p-4 font-semibold rounded-md text-sm' onClick={handleLogin}>Login with Google</button>
          } 
        </div>
        <NoteProvider>
          <div className={`${!userLoggedIn ? 'blur-sm' : ''} flex flex-col sm:flex-row sm:justify-center w-full h-5/6 sm:px-24`}>
            <Notes />
            <AddNote />
          </div>
        </NoteProvider>
    </>
  )
}


export default App