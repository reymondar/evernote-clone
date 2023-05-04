import { useState , useEffect } from 'react'
import { User, getAuth , onAuthStateChanged } from 'firebase/auth'
import { doc , getDoc , setDoc } from 'firebase/firestore'
import { db } from '@/pages'

export const useAuth = () => {
    
    const [user , setUser] = useState<User | null>(null)
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false)
    useEffect(()=>{

        const auth = getAuth()
        onAuthStateChanged(auth, (userNow) => {
            
            setUser(userNow)

            const userId = userNow?.uid as string
            setUserLoggedIn(userNow && userNow?.uid ? true : false)
            
            if(userLoggedIn){
            const docRef = doc(db , 'users' , userId)
            
            const docGetter = getDoc(docRef)
            .then(usersDoc => {
                if(usersDoc.exists()){
                    console.log('user existent')
                }
                if(!usersDoc.exists()){
                    setDoc(docRef,{})
                }
            })
        }

        }
)
    },[])

    
    return { user , userLoggedIn }
}


