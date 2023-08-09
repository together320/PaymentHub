import React, { useState, useEffect, useContext } from "react";
import TextField from '@mui/material/TextField';
import { DataGrid } from "@mui/x-data-grid";
import { useGetUserQuery } from "state/api";
import Header from "components/Header";
import { Box, useTheme } from "@mui/material";
import { refundTableColumns } from "utilities/CommonUtility";
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate  } from "react-router-dom";

const Profile = () => {
  const theme = useTheme();

  // values to send to backend
  
  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser === null) {
      navigate('/login');
    }
  }, [authUser])

  const { data, isLoading } = useGetUserQuery(authUser.id);
  console.log('dddatttta', data, authUser.id);
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Profile" subTitle="" />
      {
        data 
        ?
        <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <Box
          gridColumn="span 12"
          gridRow="span 6"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="80px"
          >
            <Box
              width="100%"
              gridColumn="span 6"
              gridRow="span 1"
              // backgroundColor={theme.palette.background.alt}
              p="1rem"
            >
              <TextField
                // disabled
                InputProps={{
                  readOnly: true,
                }}
                id="name"
                label="Merchant Name"
                style={{width:"100%"}}
                defaultValue={data.name}
              />
            </Box>
            <Box
              width="100%"
              gridColumn="span 6"
              gridRow="span 1"
              // backgroundColor={theme.palette.background.alt}
              p="1rem"
            >
              <TextField
                // disabled
                InputProps={{
                  readOnly: true,
                }}
                id="email"
                label="Email"
                style={{width:"100%"}}
                defaultValue={data.email}
              />
            </Box>
            <Box
              width="100%"
              gridColumn="span 6"
              gridRow="span 1"
              // backgroundColor={theme.palette.background.alt}
              p="1rem"
            >
              <TextField
                // disabled
                InputProps={{
                  readOnly: true,
                }}
                id="type"
                label="Transaction Type"
                style={{width:"100%"}}
                defaultValue={data.type}
              />
            </Box>
            <Box
              width="100%"
              gridColumn="span 6"
              gridRow="span 1"
              // backgroundColor={theme.palette.background.alt}
              p="1rem"
            >
              <TextField
                // disabled
                InputProps={{
                  readOnly: true,
                }}
                id="currency"
                label="Currency"
                style={{width:"100%"}}
                defaultValue={data.currency}
              />
            </Box>
            <Box
              width="100%"
              gridColumn="span 12"
              gridRow="span 1"
              // backgroundColor={theme.palette.background.alt}
              p="1rem"
            >
              <TextField
                // disabled
                InputProps={{
                  readOnly: true,
                }}
                id="apiKey"
                label="API Key"
                style={{width:"100%"}}
                defaultValue={data.apiKey}
              />
            </Box>            
          </Box>          
        </Box>
        </Box>
        :
        "Loading..."
      }
    </Box>
  );
};

export default Profile;
