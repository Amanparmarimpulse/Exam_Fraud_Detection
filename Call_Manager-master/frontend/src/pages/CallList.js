import React , {useState , useEffect} from 'react'
import Header from '../components/Header'
import VideocamIcon from '@mui/icons-material/Videocam';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { getContactList } from '../api/api';
import Modal from '@mui/material/Modal';
import AddContact from '../components/AddContact';
import Box from '@mui/material/Box';

const items = [{ person1: 'Sparsh', person2: 'Pranshi', date: 'March 26 2023', company: 'DRDO' },
{ person1: 'Sparsh', person2: 'Pranshi', date: 'March 26 2023', company: 'DRDO' },
{ person1: 'Sparsh', person2: 'Pranshi', date: 'March 26 2023', company: 'DRDO' },
{ person1: 'Sparsh', person2: 'Pranshi', date: 'March 26 2023', company: 'DRDO' }
]

const person = [{name:'Sparsh' , company:'ISRO'},{name:'Sparsh' , company:'ISRO'},
{name:'Sparsh' , company:'ISRO'},
{name:'Sparsh' , company:'ISRO'}
]

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '10px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function CallList() {
  const [contact , setContact] = useState()
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function getContacts(){
    const x = await getContactList();
    console.log(x)
    setContact(x)
  }

  useEffect(()=>{
    getContacts()
  },[])

  return (
    <>
      <Header />
      <div className='flex mt-2 ml-2 gap-x-10'>
        <div className='left-bar w-4/12'>
          <p className='text-2xl font-semibold'>Contacts</p>
          <div className='flex justify-between'>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <div className='flex items-center gap-x-2'>
          <button className='bg-blue-600 text-white border-[1px] pt-1 pb-1 pl-4 pr-5 rounded-[50px]' onClick={handleOpen} >Add</button>
          <p className='border-[1px]  border-gray-500 rounded-[20px] h-[30px] pr-4 pl-4 text-gray-500'>Sort By</p>
          </div>
          </div>
          <div className='flex flex-col gap-y-5'>
            {
              contact ? contact.map(elem => 
                <div className='flex items-center gap-x-4 pl-5'>
                  <div>
                    <Avatar src='https://mui.com/static/images/avatar/2.jpg' />
                  </div>
                  <div>
                    <p className='font-bold'>{elem.firstname}</p>
                    <p className='text-[10px]'>{elem.contact}</p>
                  </div>
                </div>
                ) :''
            }
          </div>
        </div>
        <div className='right-bar w-7/12'>
          <p className='text-2xl font-semibold mb-4'>All Calls</p>
          <div className='sorting-option flex gap-x-4 border-[1px] border-gray-500 w-[250px] pl-5 rounded-[10px]'>
            <p className='text-gray-500' >Sort By</p>
            <p className='text-gray-500' >Date</p>
            <p className='text-gray-500' >Call Duration</p>
          </div>
          <div className='mt-4'>
            {
              items ? items.map(elem =>
                <Link to='/recording/video.mp4'>
                  <div className='flex gap-x-5 mb-5'>
                  <div>
                    <VideocamIcon fontSize='large' color='primary' />
                  </div>
                  <div className='flex flex-col mb-4'>
                    <div className='flex'>
                      <p className='font-semibold' >{elem.person1}</p>
                      <p className='pl-2 pr-2'>and</p>
                      <p className='font-semibold' >{elem.person2}</p>
                      <p className='pl-2 font-bold'>{elem.company}</p>
                    </div>
                    <div className='flex'>
                      <p>{elem.date} ,</p>
                      <p className='font-bold'>{elem.company}</p>
                    </div>
                  </div>
                </div>
                </Link>
              ) : ''
            }
          </div>
        </div>
       
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      > 
      <Box sx={style}>
        <AddContact />
      </Box>
          
        </Modal>
    </>

  )
}

export default CallList