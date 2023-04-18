import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export const localStorage = create(
   persist(
    (set,get) => ({
        username: '',
        setUsername: (username) => set(()=>({username: username})),
        logout: () => set(()=>({username: ''})),
        click: false,
        setClick: (click) => set(()=>({click: click})),
        chatname: '',
        setChatname: (chatname) => set(()=>({chatname: chatname})),
        cleanChatname: () => set(()=>({chatname: ''})),
        language: 'es',
        setLanguage: (language) => set(()=>({language: language}))
    }),
    {
        name: 'quickChat-data',
    }
   )
)