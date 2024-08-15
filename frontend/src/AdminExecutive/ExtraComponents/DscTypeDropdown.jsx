import React, { useState } from 'react';

const DscTypeDropdown = () => {


  return (
      <select className='sec-indu-select sec-indu-select-gray'>
          <option>
            Only Signature
          </option>
          <option>
            Only Encryption
          </option>
          <option>
            Combo
          </option>
      </select>
  );
};

export default DscTypeDropdown;
