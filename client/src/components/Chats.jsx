import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import io from 'socket.io-client'
import {localStorage} from './storage/localstorage'
import {useNavigate} from 'react-router-dom'


const Chats = () => {
  const[chats, setChats] = useState([]);
  
  const navigate = useNavigate();
  const logout = localStorage(state=>state.logout);
  const setChatname = localStorage(state=>state.setChatname);
  const cleanChatname = localStorage(state=>state.cleanChatname);

  const getChats = async() =>{
    const peticion = await axios.get('https://quickchat.herokuapp.com/getChats');
    setChats(peticion.data);
  }

  const logoutFunction = (e) =>{
    e.preventDefault();
    logout();
    cleanChatname();
    navigate('/');
  }

  useEffect(()=>{
    getChats();
  },[])
  
  return (
    <Container className='mt-2'>
      <Card style={{height: '95vh'}}>
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
        <a onClick={logoutFunction} href='' className='text-center' style={{position: 'absolute', bottom: '0', left: '0', right: '0', textAlign: 'center', marginBottom: '0.5rem', textDecoration: 'none'}}>Cerrar sesión</a>
      </Card>
    </Container>
  )
}

export default Chats