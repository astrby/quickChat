import React, { useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import io from 'socket.io-client'
import {useNavigate} from 'react-router-dom'
import {localStorage} from './storage/localstorage'

const Join = () => {

  const socket = io.connect('http://localhost:3001')
  const navigate = useNavigate();
  const setUsername = localStorage((state)=>state.setUsername);

  const login = (e) =>{
    e.preventDefault();
    const username = document.getElementById('username').value;
    if(username){
      socket.emit('username',username);
      setUsername(username);
      navigate('/main');
    }
  }

  return (
    <Container className='text-center'>
        <Card className='w-50 mx-auto' style={{transform: 'translateY(100%)'}}>
            <Form className='w-100 mx-auto'>
                <Form.Label className='mt-3'>Ingrese el nombre de usuario</Form.Label>
                <Form.Control className='mt-2 w-75 mx-auto' id='username'/>
                <Button type='submit' className='mt-2 mb-3 w-50 py-1' onClick={login}>Ingresar</Button>
            </Form>
        </Card>
    </Container>
  )
}

export default Join