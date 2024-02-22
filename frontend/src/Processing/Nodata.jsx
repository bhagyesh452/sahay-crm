import React from 'react';
import myImage from '../static/nodatalogo.png'


function Nodata() {
  return (
    <div className='No'>
        <img className='noDataImg' src={myImage} alt="No-data-available" />
        <p className='NoDataText'>No Data Here!</p>
    </div>
  )
}

export default Nodata