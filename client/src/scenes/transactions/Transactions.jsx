import React, { useState, useEffect, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery, generalApi } from "state/api";
import Header from "components/Header";
import { Box, useTheme, Button } from "@mui/material";
// import { transactionTableColumns } from "utilities/CommonUtility";
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate  } from "react-router-dom";
import Swal from 'sweetalert2';

const Transactions = () => {
  const theme = useTheme();

  // values to send to backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();

  const transactionTableColumns = [
    {
      field: "merchantId",
      headerName: "Merchant ID",
      flex: 0.7,
    },
    {
      field: "transactionId",
      headerName: "Txn ID",
      flex: 1,
    },
    {
      field: "orderId",
      headerName: "Order ID",
      flex: 1,
    },{
      field: "orderDetail",
      headerName: "Order Detail",
      flex: 1,
    },
    {
      field: "transactionType",
      headerName: "Type",
      flex: 0.5,
    },
    {
      field: "paymentMethod",
      headerName: "Solution",
      flex: 0.5,
    },
    // {
    //   field: "name",
    //   headerName: "Name",
    //   flex: 1,
    // },
    {
      field: "cardNumber",
      headerName: "Card Number",
      flex: 1,
    },
    // {
    //   field: "cardType",
    //   headerName: "Card Type",
    //   flex: 0.5,
    // },
    // {
    //   field: "country",
    //   headerName: "Country",
    //   flex: 1,
    // },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.5,
    },
    {
      field: "currency",
      headerName: "Currency",
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
    },
    // {
    //   field: "response",
    //   headerName: "Response",
    //   flex: 1,
    // },
    {
      field: "createdAt",
      headerName: "Create Date",
      flex: 1,
    },
    {
      field: "statusDate",
      headerName: "Status Date",
      flex: 1,
    },
  ];

  if (authUser.role === "admin" || authUser.role === "superadmin") {
    transactionTableColumns.push(
      { 
        field: 'action',
        headerName: 'Action',
        sortable: false,
        flex: 1,
        renderCell: (params) => (
          <>
            <Button id="view" style={{marginRight: '10px'}} variant="contained" onClick={() => handleView(params.row)}>Detail</Button>
            <Button id="delete" variant="contained" onClick={() => handleDelete(params.row)}>Delete</Button>
          </>          
        )
      }
    );
  } else {
    transactionTableColumns.push(
      { 
        field: 'action',
        headerName: 'Action',
        sortable: false,
        flex: 1,
        renderCell: (params) => (
          <>
            <Button id="view" variant="contained" onClick={() => handleView(params.row)}>Detail</Button>
          </>          
        )
      }
    );
  }
  
  
  useEffect(() => {
    if (authUser === null) {
      navigate('/login');
    }
  }, [authUser])

  const { data, isLoading, refetch } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });
 
  const handleView = async row => {
   
    Swal.fire({
      icon: 'success',
      title: 'Transaction Detail',
      text: `${row.merchantId}'s transaction ${row.transactionId} has been ${row.status}.`,
      showConfirmButton: true,
    });
   
  };

  const handleDelete = row => {
    // setSelectedRow(row);

    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        // const [employee] = employees.filter(employee => employee.id === id);
        generalApi.general().deleteTransaction(row._id)
        .then(res => {
          
          if (res.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `${row.transactionId}'s data has been deleted.`,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            console.log(res.data.error);
            
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete.',
              showConfirmButton: true,
            });
          }

          refetch();
          
        })
        .catch(err => {
    
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to delete.',
            showConfirmButton: true,
          });

          refetch();
        });

      }
    });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TRANSACTION" subTitle="Entire list of transactions" />
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
        <DataGrid 
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={(data && data.transactions) || []}
            columns={transactionTableColumns}
            rowCount={(data && data.total) || 0}
            rowsPerPageOptions={[20, 50, 100]}
            pagination
            page={page}
            pageSize={pageSize}
            paginationMode="server"
            sortingMode="server"
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            onSortModelChange={(newSortModel) => setSort(newSortModel)}
            components={{Toolbar: DataGridCustomToolbar}}
            componentsProps={{
              toolbar: {searchInput, setSearchInput, setSearch}
            }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
