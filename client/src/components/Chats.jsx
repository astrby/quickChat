import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import {localStorage} from './storage/localstorage'
import {useNavigate} from 'react-router-dom'
import {isMobile} from 'react-device-detect'
import {useTranslation} from 'react-i18next'

const Chats = () => {
  const[chats, setChats] = useState([]);
  
  const navigate = useNavigate();
  const logout = localStorage(state=>state.logout);
  const setChatname = localStorage(state=>state.setChatname);
  const cleanChatname = localStorage(state=>state.cleanChatname);
  const username = localStorage(state=>state.username);
  const[height, setHeight] = useState('');
  const[t, i18n] = useTranslation('global');
  const language = localStorage(state=>state.language)

  const getChats = async() =>{
    const peticion = await axios.get('https://quikchat.onrender.com/getChats');
    setChats(peticion.data);
  }

  const logoutFunction = async(e) =>{
    e.preventDefault();
    await axios.post('https://quikchat.onrender.com/logout', {username: username}).then(
      logout(),
      cleanChatname(),
      navigate('/')
    );
  }

  useEffect(()=>{
    getChats();
    if(isMobile){
      setHeight('85vh')
    }else{
      setHeight('94vh')
    }
  },[])

  useEffect(()=>{
    i18n.changeLanguage(language)
  },[language])
  
  return (
    <Container className='mt-2'>
      <Card style={{height: height}}>
        <h4 className='text-center mt-3 mb-3'>Chats</h4>
        {
          chats !== null
          ?
          chats.map((chat,i)=>{
            return <a onClick={(e)=>{e.preventDefault(); setChatname(chat.chatname)}} key={i} href='' style={{textDecoration:'none'}}><Container style={{borderTopStyle: 'solid', borderBottomStyle: 'solid', borderWidth: '1px'}}>
              <h6 className='text-center mt-1'>{chat.chatname}</h6>
            </Container></a>
          })
          :''
        }
        <a href='createchat' style={{position: 'absolute', bottom: '0', left: '0', right: '0', textAlign: 'center', marginBottom: '3rem', textDecoration: 'none'}}>{t('chats.create')}</a>
        <a onClick={logoutFunction} href='' className='text-center' style={{position: 'absolute', bottom: '0', left: '0', right: '0', textAlign: 'center', marginBottom: '0.5rem', textDecoration: 'none'}}>{t('chats.logout')}</a>
      </Card>
    </Container>
  )
}

export default Chats