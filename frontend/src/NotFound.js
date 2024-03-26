import React from 'react'
import PageErrorImage from './dist/img/404Image/65.png'
import logo from './static/mainLogo.png'

function NotFound() {
  return (
    <div className='pageNotFound_main'>
      <div className='container-xl '>
        <div className='pageNotFound_Logo'>
            <img className='logo mt-2 ' src={logo}/>
        </div>
        <div className='PageError'>
            <img className='PageErrorImage' src={ PageErrorImage }  />
            <h2 className='mt-5'>Page Not Found</h2>
        </div>
      </div>
    </div>
  )
}

export default NotFound