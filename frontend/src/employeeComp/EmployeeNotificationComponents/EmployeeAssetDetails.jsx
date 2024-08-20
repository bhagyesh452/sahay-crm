import React from 'react'

function EmployeeAssetDetails({ DetailsPage }) {
  return (
    <div className='d-flex align-items-center justify-content-between'>
        EmployeeAssetDetails
        <button className='mr-2' onClick={()=>{
            DetailsPage(false)
        }}>
            Back
        </button>
    </div>
  )
}

export default EmployeeAssetDetails