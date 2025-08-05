import apiSlice from "./api-slice";
import { ORDERS_URL, PAYPAL_URL } from "../features/constants";
const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}`,
        method: "GET",
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/my-orders`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "GET",
      }),
    }),
    countTotalOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-orders`,
        method: "GET",
      }),
    }),
    calculateTotalSales: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-sales`,
        method: "GET",
      }),
    }),
    calculateTotalSalesByDate: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-sales/by-date`,
        method: "GET",
      }),
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/payment`,
        method: "PUT",
        body: details,
      }),
    }),
    deliverOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/delivery`,
        method: "PUT",
        body: details,
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),
  }),
});
export const { useCreateOrderMutation, useGetAllOrdersQuery, useGetMyOrdersQuery, useCalculateTotalSalesQuery, useCalculateTotalSalesByDateQuery, useCountTotalOrdersQuery, useDeliverOrderMutation, useGetOrderDetailsQuery, useGetPaypalClientIdQuery, usePayOrderMutation } = orderApiSlice;
