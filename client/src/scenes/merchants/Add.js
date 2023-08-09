import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Box, useTheme, useMediaQuery, Button } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Header from "components/Header";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { generalApi } from "state/api"

const Add = ({ setIsAdding }) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('');
  const [currency, setCurrency] = useState('');

  
  const [nameError, setNameError] = useState('');  
  const [emailError, setEmailError] = useState('');  
  const [passwordError, setPasswordError] = useState('');
  const [typeError, setTypeError] = useState('');
  const [currencyError, setCurrencyError] = useState('');  

  const handleAdd = e => {
    e.preventDefault();

    if (!name) {
      setNameError('Please enter merchant name.');
    } else {
      setNameError('');
    }
    
    if (!email) {
      setEmailError('Email is required.');
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email address.');
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please enter password.');
    } else {
      setPasswordError('');
    }

    if (!type) {
      setTypeError('Please select a payment type.');
    } else {
      setTypeError('');
    }

    if (!currency) {
      setCurrencyError('Please select a currency.');
    } else {
      setCurrencyError('');
    }

    if (!name || nameError || !email || emailError || !password || passwordError || !type || typeError || !currency || currencyError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }

    generalApi.general().addUser({ name, email, password, type, currency })
    .then(res => {
      
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `${name}'s data has been added.`,
          showConfirmButton: false,
          timer: 1500,
        });

        setIsAdding(false);
      } else {
        console.log(res.data.error);

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: `Failed to add(${res.data.error}).`,
          showConfirmButton: true,
        });
      }
      
    })
    .catch(err => {

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to add.',
        showConfirmButton: true,
      });
    });
    
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <Box
      mt="20px"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="60px"
      gap="20px"
      sx={{
        "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
      }}
    >
      <Box
        gridColumn="span 12"
        gridRow="span 3"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="Edit Merchant Details" />
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="80px"
        >
          <Box
            width="100%"
            gridColumn="span 4"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="name"
              label="Merchant Name"
              style={{width:"100%"}}
              defaultValue=""
              value={name}
              onChange={handleNameChange}
              error={!!nameError}
              helperText={nameError}
            />
          </Box>  
          <Box
            width="100%"
            gridColumn="span 4"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="email"
              label="Merchant Email"
              style={{width:"100%"}}
              defaultValue=""
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
            />
          </Box>  
          <Box
            width="100%"
            gridColumn="span 4"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="password"
              label="Merchant Password"
              style={{width:"100%"}}
              defaultValue=""
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
            />
          </Box>  
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Payment Type*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Payment Type"
                onChange={handleTypeChange}
                error={!!typeError}
                helperText={typeError}
              >
                <MenuItem value={'2D'}>2D</MenuItem>
                <MenuItem value={'3D'}>3D</MenuItem>
                <MenuItem value={'HPP'}>HPP</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Currency*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currency}
                label="Currency"
                onChange={handleCurrencyChange}
                error={!!currencyError}
                helperText={currencyError}
              >
                <MenuItem value={'USD'}>USD</MenuItem>
                <MenuItem value={'EUR'}>EUR</MenuItem>
                <MenuItem value={'GBP'}>GBP</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>        
      </Box> 
      <Button id="submit" variant="contained" onClick={handleAdd}>Add</Button>
      <Button id="cancel" variant="contained" onClick={() => setIsAdding(false)}>Cancel</Button>
    </Box>
  );
};

export default Add;
