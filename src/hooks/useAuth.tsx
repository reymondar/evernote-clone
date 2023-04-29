import { useState , useEffect } from 'react'
import { User, getAuth , onAuthStateChanged } from 'firebase/auth'
import { doc , getDoc , setDoc } from 'firebase/firestore'
import { db } from '@/pages'

export const useAuth = () => {

    const [user , setUser] = useState<User | null>(null)

    useEffect(()=>{
        const auth = getAuth()
        onAuthStateChanged(auth, (userNow) => {
            
            setUser(userNow)
            
            const docRef = doc(db , 'users' , userNow?.uid)
            
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
)
    },[])

    
    return { user }
}


