import React, { useState } from 'react'
import {Box, TextField, Button} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import {useDebounce} from 'use-debounce'
const InputURL = ({onSearch, setError}) => {
  const [urls, setURLs] = useState('')
  const [debounseURLs] = useDebounce(urls, 500)
  const handleSearch = async ()=>{
    if (debounseURLs.trim()) {
      const urlList = debounseURLs.split('\n').map((url)=>url.trim()).filter(Boolean)
        try { 
            onSearch(urlList)
        } catch (error) {
            console.error('Error Fetching CRUX data', error);
            setError(error.message || 'SIRRRR!!!! Failed to fetch data from CRuX API 😢😢')
        }
        setURLs('')
    }
  }
  return (

    <Box sx={{
        display: 'flex',
        gap: 4,
        my:2,
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        mx: 'auto'
    }} >
      <Box sx={{flexGrow:1, maxWidth:'600px'}}>
      <TextField
        label = 'Please enter URLs (one per line)'
        fullWidth
        variant = 'outlined'
        value = {urls}
        multiline
        onChange = {(e)=> setURLs(e.target.value)}
        />
      </Box>
        <Button variant = 'contained' onClick = {handleSearch} startIcon ={<SearchIcon/>} sx={{ px: { xs: 2, md: 4 }, height: '56px'  }}>
            Search
        </Button>
    </Box>
  )
}

export default InputURL
