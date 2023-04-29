import React , { useState }from 'react'
import { auth } from '@/pages'
import { getAuth , Auth , GoogleAuthProvider , signInWithPopup , signOut, UserProfile, UserMetadata } from 'firebase/auth'
import AddNote from './AddNote'
import Notes from './Notes'




const googleProvider = new GoogleAuthProvider()


const App = () => {
  const [user, setUser] = useState<UserMetadata | null>(null)
  const [isUserLogged, setUserLogged] = useState<boolean>(false)

  const [actualNote, setActualNote] = useState({title:'',description:'', uid:''})

  const handleLogin = () => {
    const auth = getAuth()

   signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)
   
        const user = result.user as UserMetadata
        setUser(user)
        setUserLogged(true)

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
      setUserLogged(false)
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  return (
    <>
        <div className='flex justify-center'>
            {isUserLogged ?        
            <button className='text-2xl p-4 border border-solid border-gray-400 rounded-md' onClick={handleLogout}>Logout</button>
            :
            <button className='text-2xl p-4 border border-solid border-gray-400 rounded-md' onClick={handleLogin}>Login with Google</button>
            } 
        </div>
            <h1>Hi {user?.displayName}</h1>
        <div className='flex flex-col sm:flex-row justify-between sm:justify-center w-full h-5/6 sm:px-24'>
            <Notes setActualNote={setActualNote} />
            <AddNote user={user} actualNote={actualNote} setActualNote={setActualNote} />
        </div>
    </>
  )
}


export default App