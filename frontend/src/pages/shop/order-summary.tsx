import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "@/redux/API/order-api-slice";
import type { RootState } from "@/redux/features/store";
import { DISPATCH_ACTION, PayPalButtons, SCRIPT_LOADING_STATE, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Loader2, Truck, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { 
  OnApproveData,
  OnApproveActions,
  CreateOrderData,
  CreateOrderActions,
  OrderResponseBody
} from "@paypal/paypal-js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDispatch } from "react-redux";
import { clearCartItems } from "@/redux/features/cart/cart-slice";
import type { OrderItems } from "@/types/order-type";
const OrderSummary = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch()
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: paypalLoading,
    error: paypalError,
  } = useGetPaypalClientIdQuery({});
  useEffect(() => {
    const loadPayPaylScript = async () => {
      if (paypal?.clientId) {
        paypalDispatch({
          type: DISPATCH_ACTION.RESET_OPTIONS,
          value: {
            "clientId": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: DISPATCH_ACTION.LOADING_STATUS, value: SCRIPT_LOADING_STATE.PENDING });
      }
    };
   if (paypal && !order?.isPaid && order?.paymentMethod === "PayPal") {
      loadPayPaylScript();
    }
  }, [paypal, order, paypalDispatch]);
  const createOrder = (_data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
    return actions.order
      .create({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              value: order.totalPrice.toFixed(2),
              currency_code: "USD",
            },
          },
        ],
      })
      .then((orderID: string) => {
        return orderID;
      });
  };
  const onApprove = (_data: OnApproveData, actions: OnApproveActions): Promise<void> => {
    if (actions.order && actions.order.capture) {
      return actions.order.capture().then(async function (details: OrderResponseBody) {
        try {
          await payOrder({ orderId, details });
          refetch();
          toast.success("Order is paid");
          dispatch(clearCartItems(userInfo?._id));
        } catch (err: unknown) {
          if (typeof err === "object" && err !== null && "data" in err) {
            const errorData = (err as { data?: { message?: string } }).data;
            toast.error(errorData?.message || "Failed to pay orders");
          } else {
            toast.error("Failed to pay orders");
          }
        }
      });
    }
    // Always return a Promise<void> to satisfy the type
    return Promise.resolve();
  };
  const onError = (error: unknown) => {
    if (typeof error === "object" && error !== null && "data" in error) {
        const errorData = (error as { data?: { message?: string } }).data;
        toast.error(errorData?.message || "Unknown error occurred during payment");
      } else {
        toast.error("Unknown error occurred during payment");
      }
  };
  const deliverHandler = async () => {
    await deliverOrder({ orderId });
    refetch();
  };
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

   if (loadingPay) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }
  if (isPending) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load order details
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items Table - Left Column (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {!order.orderItems || order.orderItems.length === 0 ? (
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
                    {order.orderItems.map((item: OrderItems, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <img
                            src={item.images[0].url}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </TableCell>
                        <TableCell>
                          <a
                            href={`/shop/${item.book}`}
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
                <span className="text-gray-700">
                  {order.user?.username || "N/A"}
                </span>
              </div>

              <div>
                <span className="font-semibold text-rose-500">Email: </span>
                <span className="text-gray-700">
                  {order.user?.email || "N/A"}
                </span>
              </div>

              <div>
                <span className="font-semibold text-rose-500">Address: </span>
                <span className="text-gray-700">
                  {order.shippingAddress?.address || ""},{" "}
                  {order.shippingAddress?.city || ""}{" "}
                  {order.shippingAddress?.postalCode || ""},{" "}
                  {order.shippingAddress?.country || ""}
                </span>
              </div>

              <div>
                <span className="font-semibold text-rose-500">Method: </span>
                <span className="text-gray-700">
                  {order.paymentMethod || "N/A"}
                </span>
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
              <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
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
          {!order.isPaid &&  (
             <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.paymentMethod === "PayPal"  ? (
                  // Hiển thị PayPal Buttons nếu payment method là PayPal
                  <>
                    {!paypalLoading && !paypalError && paypal?.clientId  && userInfo?.role === "user" ? (
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        {paypalLoading ? "Loading PayPal..." : "PayPal unavailable"}
                      </div>
                    )}
                  </>
                ) : order.paymentMethod === "Cash on Delivery" ? (
                  // Hiển thị thông báo thành công nếu payment method là Cash on Delivery
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-green-600">
                        Order Placed Successfully!
                      </h3>
                      <p className="text-gray-600">
                        Your order has been placed successfully. You will pay when the order is delivered.
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-700">
                          <strong>Payment Method:</strong> Cash on Delivery
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          <strong>Total Amount:</strong> ${order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Fallback cho các payment method khác
                  <div className="text-center text-gray-500">
                    Payment method: {order.paymentMethod}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Admin Delivery Button */}
          {userInfo &&
            userInfo.role === "admin" &&
            order.isPaid &&
            !order.isDelivered && (
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={deliverHandler}
                    disabled={loadingDeliver}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold cursor-pointer"
                  >
                    {loadingDeliver ? "Processing..." : "Mark As Delivered"}
                  </Button>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
