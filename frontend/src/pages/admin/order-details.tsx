import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "@/redux/API/order-api-slice";
import { useParams } from "react-router";
import { Loader2, Truck, Package, ArrowLeft } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useState } from "react";
import type { OrderItems } from "@/types/order-type";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const AdminOrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder] = usePayOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();

  const handlePaymentStatusChange = async (value: string) => {
    try {
      setIsUpdating(true);
      if (value === "paid") {
        await payOrder({ orderId, details: { status: "paid" } }).unwrap();
        toast.success("Payment marked as paid");
      }
      await refetch();
    } catch (err) {
      console.error("Error updating payment status:", err);
      toast.error("Failed to update payment status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeliveryStatusChange = async (value: string) => {
    try {
      setIsUpdating(true);
      if (value === "delivered") {
        await deliverOrder({ orderId, details: { status: "delivered" } }).unwrap();
        toast.success("Order marked as delivered");
      }
      await refetch();
    } catch (err) {
      console.error("Error updating delivery status:", err);
      toast.error("Failed to update delivery status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-slate-600 dark:text-slate-400">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/orders-list")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <Alert variant="destructive">
            <AlertDescription>Failed to load order details. Please try again.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/orders-list")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <Alert>
            <AlertDescription>Order not found.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/orders-list")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                Order Details
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Order ID: {order._id}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Table */}
            <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-900 dark:text-slate-50">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {!order.orderItems || order.orderItems.length === 0 ? (
                  <Alert>
                    <AlertDescription>Order is empty</AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-800">
                        <TableRow className="border-b border-slate-200 dark:border-slate-700">
                          <TableHead className="text-slate-700 dark:text-slate-300">Image</TableHead>
                          <TableHead className="text-slate-700 dark:text-slate-300">Product</TableHead>
                          <TableHead className="text-center text-slate-700 dark:text-slate-300">Qty</TableHead>
                          <TableHead className="text-right text-slate-700 dark:text-slate-300">Unit Price</TableHead>
                          <TableHead className="text-right text-slate-700 dark:text-slate-300">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {order.orderItems.map((item: OrderItems, index: number) => (
                          <TableRow
                            key={index}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <TableCell>
                              <img
                                src={item.images[0]?.url}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                              />
                            </TableCell>
                            <TableCell className="text-slate-900 dark:text-slate-50 font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell className="text-center text-slate-700 dark:text-slate-300">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right text-slate-700 dark:text-slate-300">
                              ${item.price.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-slate-900 dark:text-slate-50">
                              ${(item.quantity * item.price).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Shipping & Status */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Customer Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Name
                  </p>
                  <p className="text-slate-900 dark:text-slate-50 font-medium">
                    {order.user?.username || "N/A"}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-slate-900 dark:text-slate-50 font-medium break-all">
                    {order.user?.email || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Address
                  </p>
                  <p className="text-slate-900 dark:text-slate-50 text-sm">
                    {order.shippingAddress?.address || "N/A"}, {order.shippingAddress?.city || ""}{" "}
                    {order.shippingAddress?.postalCode || ""}, {order.shippingAddress?.country || ""}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-900 dark:text-slate-50">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex justify-between text-slate-700 dark:text-slate-300 text-sm">
                  <span>Items</span>
                  <span className="font-medium">${(order.itemsPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 text-sm">
                  <span>Tax</span>
                  <span className="font-medium">${(order.taxPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 text-sm">
                  <span>Shipping</span>
                  <span className="font-medium">${(order.shippingPrice || 0).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-slate-900 dark:text-slate-50 font-semibold">
                  <span>Total</span>
                  <span className="text-lg">${order.totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Status Management */}
            <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-900 dark:text-slate-50">Status Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {/* Payment Status */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-2">
                    Payment Status
                  </label>
                  <NativeSelect
                    disabled={isUpdating}
                    value={order.isPaid ? "paid" : "pending"}
                    onChange={(e) => handlePaymentStatusChange(e.target.value)}
                  >
                    <NativeSelectOption value="pending">Pending</NativeSelectOption>
                    <NativeSelectOption value="paid">Paid</NativeSelectOption>
                  </NativeSelect>
                  {order.isPaid && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">
                      Paid on {new Date(order.paidAt).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Delivery Status */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-2">
                    Delivery Status
                  </label>
                  <NativeSelect
                    disabled={isUpdating || !order.isPaid}
                    value={order.isDelivered ? "delivered" : "pending"}
                    onChange={(e) => handleDeliveryStatusChange(e.target.value)}
                  >
                    <NativeSelectOption value="pending">Pending</NativeSelectOption>
                    <NativeSelectOption value="delivered">Delivered</NativeSelectOption>
                  </NativeSelect>
                  {order.isDelivered && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">
                      Delivered on {new Date(order.deliveredAt).toLocaleString()}
                    </p>
                  )}
                  {!order.isPaid && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-2">
                      Mark as paid first to enable delivery
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-2">
                    Payment Method
                  </label>
                  <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {order.paymentMethod || "N/A"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
