import React, { useState } from 'react';
import { FaPencilAlt } from "react-icons/fa";

const DscPortalCharges = () => {


  return (
    <div className={'d-flex align-items-center justify-content-between'}>
      <div  className="My_Text_Wrap" >
        2000
      </div>
      <button className='td_add_remarks_btn'>
          <FaPencilAlt />
      </button>
    </div>
  );
};

export default DscPortalCharges;