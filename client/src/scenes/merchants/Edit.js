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

const Edit = ({ selectedRow, setIsEditing }) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const id = selectedRow._id;
  const [name, setName] = useState(selectedRow.name);
  const [type, setType] = useState(selectedRow.type);
  const [currency, setCurrency] = useState(selectedRow.currency);
  const [apiKey, setApiKey] = useState(selectedRow.apiKey);
  const [mode, setMode] = useState(selectedRow.mode);
  const [status, setStatus] = useState(selectedRow.status);

  
  const [nameError, setNameError] = useState('');  
  const [typeError, setTypeError] = useState('');
  const [currencyError, setCurrencyError] = useState('');  
  const [apiKeyError, setApiKeyError] = useState(''); 
  const [modeError, setModeError] = useState(''); 
  const [statusError, setStatusError] = useState('');

  const handleUpdate = e => {
    e.preventDefault();

    if (!name) {
      setNameError('Please enter merchant name.');
    } else {
      setNameError('');
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

    if (!apiKey) {
      setApiKeyError('Please enter API key.');
    } else {
      setApiKeyError('');
    }

    if (!mode) {
      setModeError('Please select a mode.');
    } else {
      setModeError('');
    }

    if (!status) {
      setStatusError('Please select status.');
    } else {
      setStatusError('');
    }

    if (!name || nameError || !type || typeError || !currency || currencyError || !apiKey || apiKeyError || !mode || modeError || !status || statusError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }

    generalApi.general().updateUser({ id, name, type, currency, apiKey, mode, status })
    .then(res => {
      setIsEditing(false);

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `${selectedRow.name}'s data has been updated.`,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.log(res.data.error);

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update.',
          showConfirmButton: true,
        });
      }
      
    })
    .catch(err => {
      setIsEditing(false);

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update.',
        showConfirmButton: true,
      });
    });
    
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
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
        gridRow="span 4"
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
                <MenuItem value={'2D (APM)'}>2D (APM)</MenuItem>
                <MenuItem value={'2D (APM2)'}>2D (APM2)</MenuItem>
                <MenuItem value={'S2S'}>S2S</MenuItem>
                <MenuItem value={'HPP'}>HPP</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            width="100%"
            gridColumn="span 4"
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
          <Box
            width="100%"
            gridColumn="span 12"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="apiKey"
              label="API key"
              style={{width:"100%"}}
              defaultValue=""
              value={apiKey}
              onChange={handleApiKeyChange}
              error={!!apiKeyError}
              helperText={apiKeyError}
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
              <InputLabel id="demo-simple-select-label">Mode*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={mode}
                label="Mode"
                onChange={handleModeChange}
                error={!!modeError}
                helperText={modeError}
              >
                <MenuItem value={'test'}>test</MenuItem>
                <MenuItem value={'live'}>live</MenuItem>
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
              <InputLabel id="demo-simple-select-label">Status*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Status"
                onChange={handleStatusChange}
                error={!!statusError}
                helperText={statusError}
              >
                <MenuItem value={'activated'}>activated</MenuItem>
                <MenuItem value={'deactivated'}>deactivated</MenuItem>
              </Select>
            </FormControl>
          </Box>          
        </Box>        
      </Box> 
      <Button id="submit" variant="contained" onClick={handleUpdate}>Update</Button>
      <Button id="cancel" variant="contained" onClick={() => setIsEditing(false)}>Cancel</Button>
    </Box>
    // <div className="small-container">
    //   <form onSubmit={handleUpdate}>
    //     <h1>Edit Merchant</h1>
    //     <label htmlFor="firstName">First Name</label>
    //     <input
    //       id="firstName"
    //       type="text"
    //       name="firstName"
    //       value={firstName}
    //       onChange={e => setFirstName(e.target.value)}
    //     />
    //     <label htmlFor="lastName">Last Name</label>
    //     <input
    //       id="lastName"
    //       type="text"
    //       name="lastName"
    //       value={lastName}
    //       onChange={e => setLastName(e.target.value)}
    //     />
    //     <label htmlFor="email">Email</label>
    //     <input
    //       id="email"
    //       type="email"
    //       name="email"
    //       value={email}
    //       onChange={e => setEmail(e.target.value)}
    //     />
    //     <label htmlFor="salary">Salary ($)</label>
    //     <input
    //       id="salary"
    //       type="number"
    //       name="salary"
    //       value={salary}
    //       onChange={e => setSalary(e.target.value)}
    //     />
    //     <label htmlFor="date">Date</label>
    //     <input
    //       id="date"
    //       type="date"
    //       name="date"
    //       value={date}
    //       onChange={e => setDate(e.target.value)}
    //     />
    //     <div style={{ marginTop: '30px' }}>
    //       <input type="submit" value="Update" />
    //       <input
    //         style={{ marginLeft: '12px' }}
    //         className="muted-button"
    //         type="button"
    //         value="Cancel"
    //         onClick={() => setIsEditing(false)}
    //       />
    //     </div>
    //   </form>
    // </div>
  );
};

export default Edit;
