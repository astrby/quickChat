import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import {useTranslation} from 'react-i18next'
import {localStorage} from './storage/localstorage'

const NB = () => {

    const[i18n] = useTranslation('global');
    const setLanguage = localStorage(state=>state.setLanguage);


    const handleEs = () =>{
        const lang = document.getElementById('es').value;
        setLanguage(lang)
    }

    const handleEn = () =>{
        const lang = document.getElementById('en').value;
        setLanguage(lang)
    }

  return (
    <Navbar className='justify-content-end'>
        <Button onClick={handleEs} className='py-0 px-0' id='es' value="es">ES</Button>
        <Button onClick={handleEn}  className='ms-1 me-2 py-0 px-0' id='en' value="en">EN</Button>
    </Navbar>
  )
}

export default NB