import React , {useState , useEffect}from 'react'
import {Box , TextField} from '@mui/material'
import {DateRange , DateRangePicker} from '@mui/lab'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


const MaterialUIPickers=()=>{
    const[value , setValue] = useState([null , null])

    return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box style={{width:"500px"}}>
        <DateRangePicker startText='Checkin' endText='CheckOut' 
        value = {value}
        onChange={newValue=>{setValue(newValue)}} 
        renderInputs ={(startProps , endProps)=>(
            <>
            <TextField {...startProps} />
            <TextField {...endProps} />
            
            </>
        )} />

    </Box>
    </LocalizationProvider>
    )

}
export default MaterialUIPickers;