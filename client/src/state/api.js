import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json"
  }
});

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Customers",
    "Products",
    "Transactions",
    "Refunds",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard"
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => `client/products`,
      providesTags: ["Products"],
    }),
    getMerchants: build.query({
      query: () => `client/merchants/`,
      providesTags: ["Merchants"],
    }),
    getTransactions: build.query({
      query: ({ id, page, pageSize, sort, search }) => ({
        url: `client/transactions`,
        method: "GET",
        params: { id: JSON.stringify(id), page, pageSize, sort, search },
      }),
      tagTypes: ["Transactions"],
    }),
    getRefunds: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: `client/refunds`,
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      tagTypes: ["Refunds"],
    }),
    getGeoLocations: build.query({
      query: () => `client/geography`,
      providesTags: ["Geography"],
    }),
    getOverallSales: build.query({
      query: () => `sales/sales`,
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => `management/admin`,
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: ({id, startDate, endDate}) => ({
        url: `general/dashboard`,
        method: "GET",
        params: { id: JSON.stringify(id), startDate, endDate },
      }),
      tagTypes: ["Dashboard"],
    }),
    getChart: build.query({
      query: ({id, startDate, endDate}) => ({
        url: `general/chart`,
        method: "GET",
        params: { id: JSON.stringify(id), startDate, endDate },
      }),
      tagTypes: ["Chart"],
    }),
    getPie: build.query({
      query: ({id, startDate, endDate}) => ({
        url: `general/pie`,
        method: "GET",
        params: { id: JSON.stringify(id), startDate, endDate },
      }),
      tagTypes: ["Pie"],
    })
  }),
});

export const authApi = {
  auth(url = 'auth') {
    return {
        login: ({email, password}) => http.post(url + '/login', {email, password}),
        register: ({email, name, password}) => http.post(url + '/register', {email, name, password})
    }
  },

  map(url = 'map') {
      const config = {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      };

      return {
          fetchAll: () => http.get(url + '/list', config),
          fetchPagination: (page, limit, name, category) => 
              http.get(url + "?page=" + page + "&limit=" + limit + "&name=" + name + "&category=" + category, config),
          fetchById: id => http.get(url + "/" + id, config),
          create: newRecord => http.post(url, newRecord, config),
          update: (id, updatedRecord) => http.put(url + "/" + id, updatedRecord, config),
          delete: id => http.delete(url + "/" + id, config)
      }
  },

  user(url = 'user') {
      const config = {
        headers: {
          'authorization': 'Bearer ' + localStorage.getItem('token')
        }
      };

      return {
          fetchAll: () => http.get(url + '/list', config),
          fetchPagination: (page, limit = 10, name = null, email = null) => 
              http.get(url + "?page=" + page + "&limit=" + limit + "&name=" + name + "&email=" + email, config),
          fetchById: id => http.get(url + "/" + id, config),
          create: newRecord => http.post(url, newRecord, config),
          update: (id, updatedRecord) => http.put(url + "/" + id, updatedRecord, config),
          delete: id => http.delete(url + "/" + id, config)
      }
  }

};

export const generalApi = {
  general(url = 'general') {
    return {
        getUser: (id) => http.get(url + `/getUser/${id}`).then(res => res.data),
        addUser: ({name, email, password, type, currency, apiKey}) => http.post(url + `/addUser`, {name, email, password, type, currency, apiKey}),
        updateUser: ({id, name, type, currency, apiKey, mode, status}) => http.post(url + `/updateUser`, {id, name, type, currency, apiKey, mode, status}),
        deleteUser: (id) => http.post(url + `/deleteUser`, {id}),
        deleteTransaction: (id) => http.post(url + `/deleteTransaction`, {id}),

    }
  },

};

export const paymentApi = {
  payment(url = 'payment') {
    return {
        payment2d: (headers, payload) => http.post(url + `/2d`, payload, { headers }),
        
    }
  },

};

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetMerchantsQuery,
  useGetTransactionsQuery,
  useGetRefundsQuery,
  useGetGeoLocationsQuery,
  useGetOverallSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useGetChartQuery,
  useGetPieQuery
} = api;
