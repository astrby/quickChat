import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import { io } from "socket.io-client";
import {localStorage} from './storage/localstorage'
import {useNavigate} from 'react-router-dom'

const Chats = () => {

  const[chats, setChats] = useState([]);
  const socket = io.connect('http://quickchat-production-3880.up.railway.app');
  const click = localStorage(state=>state.click);
  const setClick = localStorage(state=>state.setClick)
  const navigate = useNavigate();
  const logout = localStorage(state=>state.logout);
  const chatname = localStorage(state=>state.chatname);
  const setChatname = localStorage(state=>state.setChatname);
  const cleanChatname = localStorage(state=>state.cleanChatname);

  const getChats = async() =>{
    const peticion = await axios.get('http:quickchat-production-3880.up.railway.app/getChats');
    setChats(peticion.data);
  }

  const getChat = (chatName) =>{
    if(chatName){
      socket.emit('chatName', chatName);
      setChatname(chatName);
      if(click === false){
        setClick(true);
      }else{
        setClick(false);
      }
    }else{
      socket.emit('chatName', chatname);
    }
  }

  const logoutFunction = (e) =>{
    e.preventDefault();
    logout();
    cleanChatname();
    navigate('/');
  }

  useEffect(()=>{
    getChats();
    getChat();
  },[])
  
  return (
    <Container className='mt-2'>
      <Card style={{height: '95vh'}}>
        <h4 className='text-center mt-3 mb-3'>Chats</h4>
        {
          chats !== null
          ?
          chats.map((chat,i)=>{
            return <a onClick={(e)=>{e.preventDefault();getChat(chat.chatName)}} key={i} href='' style={{textDecoration:'none'}}><Container style={{borderTopStyle: 'solid', borderBottomStyle: 'solid', borderWidth: '1px'}}>
              <h6 className='text-center mt-1'>{chat.chatName}</h6>
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