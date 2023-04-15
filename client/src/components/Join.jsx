import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import {useNavigate} from 'react-router-dom'
import {localStorage} from './storage/localstorage'
import logo from './assets/logo.png'
import { isMobile } from 'react-device-detect'
import socketIO from 'socket.io-client';
const socket = socketIO.connect('https://quickchat.herokuapp.com/')

const Join = () => {

  const navigate = useNavigate();
  const setUsername = localStorage((state)=>state.setUsername);
  const[height, setHeight] = useState('');
  const[boxWidth, setBoxWidth] = useState('');
  
  const login = (e) =>{
    e.preventDefault();
    const username = document.getElementById('username').value;
    if(username){
      socket.emit('username',username);
      setUsername(username);
      navigate('/main')
    }
  }

  useEffect(()=>{
    if(isMobile){
      setHeight('translateY(50%)')
      setBoxWidth('w-75')
    }else{
      setHeight('translateY(75%)')
      setBoxWidth('w-50')
    }
  },[])

  return (
    <>
    {
      <Container className='text-center'>
        <Card className = {boxWidth+' mx-auto'} style={{transform: height}}>
          <Form.Label className='mt-2 mx-auto'><img src={logo} style={{width: '4rem', marginRight: '0.5rem'}}/><h3 style={{display: 'inline-block', paddingTop: '1.5rem', color: 'white'}}>QuickChat</h3></Form.Label>
              <Form className='w-100 mx-auto'>
                  <Form.Label className='mt-3'>Ingrese el nombre de usuario</Form.Label>
                  <Form.Control className='mt-2 w-75 mx-auto' id='username'/>
                  <Button type='submit' className='mt-2 mb-3 w-50 py-1' onClick={login}>Ingresar</Button>
              </Form>
          </Card>
      </Container>
    }
    </>
    
  )
}

export default Join