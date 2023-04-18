import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import socketIO from 'socket.io-client'
import {localStorage} from './storage/localstorage'
import {storage} from './storage/firebase'
import {ref, getDownloadURL, uploadBytes} from 'firebase/storage'
import {isMobile} from 'react-device-detect'
import {useTranslation} from 'react-i18next'

let socket = socketIO.connect('https://quikchat.onrender.com/');

const Chat = () => {
  
  const username = localStorage((state)=> state.username)
  const[chatArray, setChatArray] = useState([]);
  const[clickSend, setClickSend] = useState(false);
  const chatname = localStorage(state=>state.chatname);
  const[height, setHeight] = useState('');
  const[t, i18n] = useTranslation("global");
  const language = localStorage(state=>state.language)

  const sendMessage = (e) =>{
    e.preventDefault();
    var data = [];
    const message = document.getElementById('message').value;
    const file = document.getElementById('file').files[0];

    if(message){
      data.push({
        chatname: chatname,
        username: username,
        message: message
      })
      
      socket.emit('message', data);

      if(clickSend === false){
        setClickSend(true);
      }else{
        setClickSend(false);
      }
    }
    if(file){
      const storageRef = ref(storage, `quickChat/users/${username}/imgs/${Date.now()+'_'+file.name}`);
      uploadBytes(storageRef, file).then((snapshot)=>{
        getDownloadURL(snapshot.ref).then((urlImage)=>{
          data.push({
            chatname: chatname,
            username: username,
            message: urlImage
          })
          
          socket.emit('message', data)
        })
      })
      
      if(clickSend === false){
        setClickSend(true);
      }else{
        setClickSend(false);
      }
    }
    if(document.getElementById('chat') !== null){
      document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
    }
  }

  useEffect(()=>{
    if(isMobile){
      setHeight('80vh')
    }else{
      setHeight('90vh')
    }
  },[])

  useEffect(()=>{
    i18n.changeLanguage(language)
  },[language])

  useEffect(()=>{
    if(chatname){
      socket.emit('chatname', chatname);
      socket.on('chat', (chat)=>{
        setChatArray(chat[0].chat);
        if(document.getElementById('chat') !== null){
          document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
        }
      })
      return()=>{
        socket.off('chat')
      }
    }
  },[chatname])

  useEffect(()=>{
    socket.on('newMessage', (newMessage)=>{
      setChatArray(chatArray => [...chatArray, newMessage])
      if(document.getElementById('chat') !== null){
        document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
      }
    })
    return()=>{
      socket.off('newMessage')
    } 
  },[socket])

  return (
    <>
      {
        chatname
        ?
        [<Container key={0} className='mt-2' style={{backgroundColor: 'white', height: height, borderRadius: '5px', width: '100%', display: 'flex',flexFlow: 'column nowrap', paddingTop: '1rem', overflowY: 'scroll', paddingBottom: '2rem'}} id='chat'>
          {
            chatArray.map((chat,i)=>{
              if(chat.username.toString() === username.toString()){
                if(chat.message.substring(0,5) === 'https'){
                  return <p key={i}  style={{backgroundColor: '#99CCFF', color: 'black', width: '50%', paddingLeft: 'auto', borderRadius: '5px', paddingRight: '0.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center'}}>{chat.username}: <img src={chat.message} className='w-100 ms-1' style={{overflow: 'hidden'}}/></p>
                }
                return <p key={i} style={{color: 'black', backgroundColor: '#A9DFBF', width: '50%', marginLeft: 'auto', borderRadius: '5px', paddingLeft: '0.1rem', paddingRight: '0.1rem', wordWrap: 'break-word'}}>{chat.message}</p>
              }else{
                if(chat.message.substring(0,5) === 'https'){
                  return <p key={i}  style={{backgroundColor: '#A9DFBF', width: '50%', marginLeft: 'auto', borderRadius: '5px', paddingLeft: '0.1rem', paddingRight: '0.1rem', marginBottom: '0.75rem'}}><img src={chat.message} className='w-100' /></p>
                }
                return <p key={i} style={{color: 'black', backgroundColor: '#99CCFF', width: '50%', marginRight: 'auto', borderRadius: '5px', paddingLeft: '0.1rem', paddingRight: '0.1rem', wordWrap: 'break-word'}}>{chat.username+': '+ chat.message}</p>
              }
            })
          }
          </Container>,
          <Container key={1} style={{display: 'inline-block'}} fluid className='p-0'>
            <Form.Control style={{display: 'inline-block', width:'75%'}} id='message'></Form.Control>
            <label htmlFor='file' style={{width: '5%', textAlign: 'center'}}>📁</label>
            <input id='file' type='file' style={{display: 'none'}} placeholder='📁'></input>
            <Button type='submit' onClick={sendMessage} variant='info' style={{display: 'inline-block',width:'20%'}}>{t('chat.send')}</Button>
          </Container>]
        : <Card style={{height: '95vh', marginTop: '1rem'}}>
            <h5 className='mx-auto mt-4'>
              {t('chat.select')}
            </h5>
          </Card>
      }
    </>
  )
}

export default Chat