import React, { useEffect, useState } from 'react';
import { MdDateRange } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { RxAvatar } from "react-icons/rx";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FcOpenedFolder } from "react-icons/fc";
import Swal from "sweetalert2";
import axios from "axios";
import io from "socket.io-client";
import Nodata from "../../components/Nodata";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

let ename;

function EmployeeGeneralDataComponent() {
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const fetchRequestGDetails = async()=>{
    try{
      const response = await axios.get(`${secretKey}/requests/requestdata/${ename}` , )

    }catch(error){
      console.log("Error fetching request data" , error.messgae)
    }
  }




















  return (
    <div>EmployeeGeneralDataComponent</div>
  )
}

export default EmployeeGeneralDataComponent