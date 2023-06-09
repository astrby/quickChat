import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Chats from './Chats'
import Chat from './Chat'
import {localStorage} from './storage/localstorage'
import { isMobile } from 'react-device-detect'

const Main = () => {

  const cleanChatname = localStorage(state=>state.cleanChatname);
  const chatname = localStorage(state=>state.chatname);

  const goBack = (e) =>{
    e.preventDefault();
    cleanChatname();
  }

  return (
    <Container fluid>
        <Row>
          {
            !isMobile 
            ?
              [<Col key={0} xs={4}><Chats/></Col>,
              <Col key={1} xs={8}><Chat/></Col>]
            :
              chatname.length > 0
              ?
                [<a key={2} href='' style={{textDecoration:'none', marginTop: '0.75rem'}} onClick={goBack}>Volver atrás</a>,
                <Col key={3} xs={12}><Chat/></Col>]
              : 
                <Col  key={4} xs={12}><Chats/></Col>
          }
        </Row>
    </Container>
  )
}

export default Main