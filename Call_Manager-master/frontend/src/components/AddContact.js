import React , {useState,  useEffect} from 'react'
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { addContactFirestore } from '../api/api';
function AddContact() {

   const [data , setData] = useState({
    username:"",
    firstname:"",
    lastname:"",
    email:"",
    contact:""
   }) 

   console.log(data)

   async function addContact(){
    const x = await addContactFirestore(data)
    console.log(x)
   }
  return (
    <div>
        <p>Add Contact</p>
        <FormControl variant="standard">
        <InputLabel htmlFor="input-with-icon-adornment">
          Username
        </InputLabel>
        <Input
          id="input-with-icon-adornment"
          value = {data.username}
          onChange={(e) => setData(prevData =>({
            ...prevData,
            username:e.target.value}
      ))}
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl variant="standard">
      <InputLabel htmlFor="input-with-icon-adornment">
          FirstName
        </InputLabel>
        <Input
            value = {data.firstname}
            onChange={(e) => setData(prevData =>({
                ...prevData,
                firstname:e.target.value}
          ))}
          id="input-with-icon-adornment"
        />
      </FormControl>

      <FormControl variant="standard">
      <InputLabel htmlFor="input-with-icon-adornment">
          LastName
        </InputLabel>
        <Input
        value = {data.lastname}
        onChange={(e) => setData(prevData =>({
            ...prevData,
            lastname:e.target.value}
      ))}
          id="input-with-icon-adornment"
        />
      </FormControl>

      <FormControl variant="standard">
      <InputLabel htmlFor="input-with-icon-adornment">
          Contact
        </InputLabel>
        <Input
        value = {data.contact}
        onChange={(e) => setData(prevData =>({
            ...prevData,
            contact:e.target.value}
      ))}
          id="input-with-icon-adornment"
        />
      </FormControl>
      <FormControl variant="standard">
      <InputLabel htmlFor="input-with-icon-adornment">
          Email
        </InputLabel>
        <Input
        value = {data.email}
          onChange={(e) => setData(prevData =>({
                ...prevData,
                email:e.target.value}
          ))}
          id="input-with-icon-adornment"
        />
      </FormControl>
      <button onClick={addContact} className='bg-green-600 pl-4 pr-4 pt-2 pb-2 mt-3 text-white rounded-[50px]'>Add</button>
    </div>
  )
}

export default AddContact