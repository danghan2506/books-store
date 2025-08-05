import { useDeliverOrderMutation, useGetOrderDetailsQuery, useGetPaypalClientIdQuery, usePayOrderMutation } from '@/redux/API/order-api-slice'
import type { RootState } from '@/redux/features/store'
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { CreditCard, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
const OrderSummary = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const {userInfo} = useSelector((state: RootState) => state.auth)
  const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId)
  const {orderItems} = order.orderItems
  const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation()
  const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation()
  const [{isPending}, paypalDispatch] = usePayPalScriptReducer()
  const {data: paypal, isLoading: paypalLoading, error: paypalError} = useGetPaypalClientIdQuery()
  useEffect(() => {
    const loadPayPaylScript = async() => {
        if(paypal?.clientId){
            paypalDispatch({
                type: "resetOptions",
                value: {
                    "client-id" : paypal.clientId,
                    currency: "USD",
                }
            })
            paypalDispatch({type: "setLoadingStatus", value: "pending"})
        }
    }
    if(paypal && !order?.isPaid){
        loadPayPaylScript()
    }
  }, [paypal, order, paypalDispatch])
  const createOrder = (data, actions) => {
    return actions.order.create({
        purchase_units: [{ amount: { 
          value: order.totalPrice.toFixed(2),
          currency_code: "USD"
        } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }
    const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
        console.log("PayPal payment details:", details);
      } catch (error) {
        toast.error(error);
      }
    });
  };
    const onError = (error) => {
    toast.error(error);
  };
    const deliverHandler = async () => {
    await deliverOrder({orderId});
    refetch();
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items Table - Left Column (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {!orderItems || orderItems.length === 0 ? (
                <Alert>
                  <AlertDescription>Order is empty</AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.orderItems.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </TableCell>
                        <TableCell>
                          <a
                            href={`/product/${item.product}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                          >
                            {item.name}
                          </a>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${(item.quantity * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Shipping, Summary, Payment */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-semibold text-rose-500">Order: </span>
                <span className="text-gray-700">{order._id}</span>
              </div>

              <div>
                <span className="font-semibold text-rose-500">Name: </span>
                <span className="text-gray-700">{order.user?.username || 'N/A'}</span>
              </div>

              <div>
                <span className="font-semibold text-rose-500">Email: </span>
                <span className="text-gray-700">{order.user?.email || 'N/A'}</span>
              </div>

              <div>
                <span className="font-semibold text-rose-500">Address: </span>
                <span className="text-gray-700">
                  {order.shippingAddress?.address || ''},{" "}
                  {order.shippingAddress?.city || ''}{" "}
                  {order.shippingAddress?.postalCode || ''},{" "}
                  {order.shippingAddress?.country || ''}
                </span>
              </div>

              <div>
                <span className="font-semibold text-rose-500">Method: </span>
                <span className="text-gray-700">{order.paymentMethod || 'N/A'}</span>
              </div>

              <div>
                {order.isPaid ? (
                  <Badge className="bg-green-500 text-white">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </Badge>
                ) : (
                  <Badge className="bg-red-500 text-white">Not paid</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Items</span>
                <span className="font-medium">
                  ${(order.itemsPrice || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Shipping</span>
                <span className="font-medium">
                  ${(order.shippingPrice || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">Tax</span>
                <span className="font-medium">
                  ${(order.taxPrice || 0).toFixed(2)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  ${(order.totalPrice || 0).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          {!order.isPaid && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!paypalLoading && !paypalError && paypal?.clientId ? (
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    {paypalLoading ? 'Loading PayPal...' : 'PayPal unavailable'}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Admin Delivery Button */}
          {userInfo && userInfo.role === "admin" && order.isPaid && !order.isDelivered && (
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={deliverHandler}
                  disabled={loadingDeliver}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold cursor-pointer"
                >
                  {loadingDeliver ? 'Processing...' : 'Mark As Delivered'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderSummary