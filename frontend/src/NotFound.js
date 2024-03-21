import React from 'react'
//import   PageErrorImage  from './dist/img/404Image/228310-P2FL95-675.jpg'
import   PageErrorImage  from './dist/img/404Image/65.jpg'

function NotFound() {
  return (
    <div className='container-xl d-flex align-items-center justify-content-center w-100 mt-8'>

    <img src={ PageErrorImage } style={{width:"50vw" , height:"70vh" , mixBlendMode:"darken"}}  />
    
    </div>
  )
}

export default NotFound