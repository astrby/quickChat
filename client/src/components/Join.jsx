import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import {useNavigate} from 'react-router-dom'
import {localStorage} from './storage/localstorage'
import logo from './assets/logo.png'
import { isMobile } from 'react-device-detect'
import axios from 'axios'
import Alert from 'react-bootstrap/Alert'

const Join = () => {

  const navigate = useNavigate();
  const setUsername = localStorage((state)=>state.setUsername);
  const[height, setHeight] = useState('');
  const[boxWidth, setBoxWidth] = useState('');
  const[alert, setAlert] = useState('');
  const localUsername = localStorage((state)=>state.username);
  
  const login = async(e) =>{
    e.preventDefault();
    const username = document.getElementById('username').value;
    if(username){
      const peticion = await axios.post('https://quickchat.herokuapp.com/join', {username: username});
      if(peticion.data === 'connected'){
        setAlert('connected');
        setTimeout(() => {
          setAlert('');
        }, 2000);
      }else{
        setUsername(peticion.data);
        navigate('/main')
      }
      
    }
  }

  useEffect(()=>{
    if(localUsername.length === 0){
        if(isMobile){
          setHeight('translateY(50%)')
          setBoxWidth('w-75')
        }else{
          setHeight('translateY(75%)')
          setBoxWidth('w-50')
        }
    }else{
      navigate('/main')
    }
  },[])

  return (
    <>
    {
      alert === 'connected'
      ?
      <Alert className='mx-auto mt-2 px-2' style={{position: 'absolute', left: '0', right: '0', width: '300px', backgroundColor: '#FF8000', textAlign: 'center'}}>El nombre de usuario ya se encuetra conectado</Alert>
      :''
    }
    {
      <Container className='text-center'>
        <Card className = {boxWidth+' mx-auto'} style={{transform: height}}>
          <Form.Label className='mt-2 mx-auto'><img src={logo} style={{width: '4rem', marginRight: '0.5rem'}}/><h3 style={{display: 'inline-block', paddingTop: '1.5rem', color: 'white'}}>QuickChat</h3></Form.Label>
              <Form className='w-100 mx-auto'>
                  <Form.Label className='mt-3'>Ingrese el nombre de usuario</Form.Label>
                  <Form.Control className='mt-2 w-75 mx-auto' id='username' style={{textAlign: 'center'}}/>
                  <Button type='submit' className='mt-2 mb-3 w-50 py-1' onClick={login}>Ingresar</Button>
              </Form>
          </Card>
      </Container>
    }
    </>
    
  )
}

export default Join