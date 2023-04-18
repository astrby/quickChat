import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import {isMobile} from 'react-device-detect'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import {useTranslation} from 'react-i18next'
import {localStorage} from './storage/localstorage'

const CreateChat = () => {

    const[boxHeight, setBoxHeight] = useState('');
    const[boxWidth, setBoxWidth] = useState('');
    const[alert, setAlert] = useState('');
    const navigate = useNavigate();
    const[t, i18n] = useTranslation("global");
    const language = localStorage(state=>state.language)

    const createChat = async() =>{
        const chatname = document.getElementById('chatname').value;

        if(chatname){
            const peticion = await axios.post('https://quikchat.onrender.com/createGroup', {chatname: chatname})
            if(peticion.data === 'success'){
                navigate('/main')
            }else{
                setAlert('exists')
                setTimeout(() => {
                    setAlert('');
                }, 2000);
            }
        }else{
            setAlert('error')
                setTimeout(() => {
                    setAlert('');
                }, 2000);
        }
    }

    useEffect(()=>{
        if(isMobile){
            setBoxHeight('translateY(50%)');
            setBoxWidth('w-75');
        }else{
            setBoxHeight('translateY(75%)');
            setBoxWidth('w-50');
        }
    },[])

    useEffect(()=>{
        i18n.changeLanguage(language)
      },[language])

    return (
        <>
            {
                alert === 'exists'
                ?
                <Alert className='mx-auto py-2 mt-2' style={{position: 'absolute', left: '0', right: '0', backgroundColor: '#FF8000', width: '300px'}}>{t("createChat.errorExists")}</Alert>
                :
                alert === 'error'
                ?
                <Alert className='mx-auto py-2 mt-2' style={{position: 'absolute', left: '0', right: '0', backgroundColor: '#FF8000', width: '300px'}}>{t("createChat.errorFill")}</Alert>
                :''
            }
            <Container>
                <Card className={boxWidth+' mx-auto'} style={{transform: boxHeight}}>
                    <Form.Label className='mx-auto mt-2'>{t("createChat.title")}</Form.Label>
                    <Form.Control className='w-75 mx-auto' id='chatname' style={{textAlign: 'center'}}/>
                    <Button type='submit' className='w-50 mx-auto mt-2 mb-2' onClick={createChat}>{t("createChat.create")}</Button>
                </Card>
            </Container>
        </>
    
    )
}

export default CreateChat