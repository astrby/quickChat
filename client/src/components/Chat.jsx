import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import io from 'socket.io-client'
import {localStorage} from './storage/localstorage'
import {storage} from './storage/firebase'
import {ref, getDownloadURL, uploadBytes} from 'firebase/storage'

const Chat = () => {
  const socket = io.connect('https://quickchat.herokuapp.com/');
  const username = localStorage((state)=> state.username)
  const click = localStorage(state=>state.click);
  const[chatArray, setChatArray] = useState([]);
  const[clickSend, setClickSend] = useState(false);
  var data = [];
  const chatname = localStorage(state=>state.chatname);

  const sendMessage = (e) =>{
    e.preventDefault();
    const message = document.getElementById('message').value;
    const file = document.getElementById('file').files[0];

    if(message){
      data.push({
        chatname: chatname,
        username: username,
        message: message
      })
      socket.emit('data', data);
      setChatArray([...chatArray, ...data]);
      data = [];
      if(clickSend === false){
        setClickSend(true);
      }else{
        setClickSend(false);
      }
    }
    if(file){
      const storageRef = ref(storage, `quickChat/users/${username}/imgs/${Date.now()+'_'+file.name}`);
      console.log(username)
      uploadBytes(storageRef, file).then((snapshot)=>{
        getDownloadURL(snapshot.ref).then((urlImage)=>{
          const data = [];
          data.push({
            chatname: chatname,
            username: username,
            message: urlImage
          })
          socket.emit('data', data);
          setChatArray([...chatArray, ...data]);
          data = [];
        })
      })
      
      if(clickSend === false){
        setClickSend(true);
      }else{
        setClickSend(false);
      }
    }
  }

  const getChat = () =>{
    socket.on('chat', chat =>{
      setChatArray(chat[0].chat);
      if(chatArray.length > 0){
        var chat = document.getElementById('chat');
        chat.scrollTop = chat.scrollHeight;
      }
    });
  }

  useEffect(()=>{
    getChat();
  },[clickSend, click])

  useEffect(()=>{
    if(chatArray.length > 0){
      var chat = document.getElementById('chat');
      chat.scrollTop = chat.scrollHeight;
    }
  },[socket])

  return (
    <>
      {
        chatArray.length > 0
        ?
        [<Container key={0} className='mt-2' style={{backgroundColor: 'white', height: '90vh', borderRadius: '5px', width: '100%', display: 'flex',flexFlow: 'column nowrap', paddingTop: '1rem', overflowY: 'scroll', paddingBottom: '1rem'}} id='chat'>
          {
            chatArray.map((chat,i)=>{
              if(chat.username === username){
                if(chat.message.substring(0,5) === 'https'){
                  return <img src={chat.message} key={i} style={{backgroundColor: '#A9DFBF', width: '50%', marginLeft: 'auto', borderRadius: '5px', paddingLeft: '0.1rem', paddingRight: '0.1rem'}}></img>
                }
                return <p key={i} style={{color: 'black', backgroundColor: '#A9DFBF', width: '50%', marginLeft: 'auto', borderRadius: '5px', paddingLeft: '0.1rem', paddingRight: '0.1rem', wordWrap: 'break-word'}}>{chat.message}</p>
              }else{
                if(chat.message.substring(0,5) === 'https'){
                  return <img  key={i} src={chat.message} style={{backgroundColor: '#A9DFBF', width: '50%', marginLeft: 'auto', borderRadius: '5px', paddingLeft: '0.1rem', paddingRight: '0.1rem'}}/>
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
              <Button type='submit' onClick={sendMessage} variant='info' style={{display: 'inline-block',width:'20%'}}>Enviar</Button>
            </Container>]
        : <Card style={{height: '95vh', marginTop: '1rem'}}>
            <h5 className='mx-auto mt-4'>
              Selecccione el chat
            </h5>
          </Card>
      }
    </>
  )
}

export default Chat