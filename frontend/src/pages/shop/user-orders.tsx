import { Link  } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Package, Eye } from "lucide-react";
import { useGetMyOrdersQuery } from "@/redux/API/order-api-slice";
import type { Order} from "@/types/order-type";
interface StatusBadgeProps {
  status: boolean
  type?: "payment" | "delivery"
}
const UserOrders = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery({});
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toISOString().substring(0, 10);
  };
  const StatusBadge = ({ status }: StatusBadgeProps) => {
    const variant = status ? "default" : "destructive";
    const className = status
      ? "bg-green-100 text-green-800 hover:bg-green-100"
      : "bg-red-100 text-red-800 hover:bg-red-100";

    return (
      <Badge variant={variant} className={className}>
        {status ? "Completed" : "Pending"}
      </Badge>
    );
  };
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 ">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <Alert variant="destructive">
          <AlertDescription>
           
            An error occurred while loading your orders
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-20 sm:pt-24 md:pt-28 pb-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Package className="h-6 w-6 sm:h-7 sm:w-7 text-red-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Orders
          </h1>
        </div>

        {orders?.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
              <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                No orders found
              </h3>
              <p className="text-muted-foreground text-center">
                You haven't placed any orders yet.
              </p>
              <Button asChild className="mt-4 bg-red-500 hover:bg-red-600">
                <Link to="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Product
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Order ID
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Date
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Total
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Payment
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Delivery
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders?.map((order : Order, index: number) => (
                          <tr
                            key={order._id}
                            className={`border-b transition-colors hover:bg-muted/30 ${
                              index === orders.length - 1 ? "border-b-0" : ""
                            }`}
                          >
                            <td className="p-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                <img
                                  src={
                                    order.orderItems[0]?.images[0].url ||
                                    "/api/placeholder/64/64"
                                  }
                                  alt="Product"
                                  className="w-full h-full object-cover"
 onError={(e) => {
                                  const target = e.target;
                                  if (target instanceof HTMLElement) {
                                    target.style.display = "none";

                                    const nextSibling = target.nextSibling;
                                    if (nextSibling instanceof HTMLElement) {
                                      nextSibling.style.display = "flex";
                                    }
                                  }
                                }}
                                />
                                <Package
                                  className="h-6 w-6 text-muted-foreground"
                                  style={{ display: "none" }}
                                />
                              </div>
                            </td>
                            <td className="p-4">
                              <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                                {order._id.slice(-8)}
                              </code>
                            </td>
                            <td className="p-4 text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="p-4 font-semibold text-gray-800">
                              ${order.totalPrice.toFixed(2)}
                            </td>
                            <td className="p-4">
                              <StatusBadge status={order.isPaid} type="payment" />
                            </td>
                            <td className="p-4">
                              <StatusBadge status={order.isDelivered} type="delivery" />
                            </td>
                            <td className="p-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-red-50 hover:border-red-200"
                                onClick={() =>
                                  window.open(`/order/${order._id}`, "_self")
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tablet Table View */}
            <div className="hidden md:block lg:hidden">
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                            Product
                          </th>
                          <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                            Order
                          </th>
                          <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                            Total
                          </th>
                          <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                            Status
                          </th>
                          <th className="text-left p-3 font-semibold text-gray-700 text-sm">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders?.map((order: Order, index: number) => (
                          <tr
                            key={order._id}
                            className={`border-b transition-colors hover:bg-muted/30 ${
                              index === orders.length - 1 ? "border-b-0" : ""
                            }`}
                          >
                            <td className="p-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                  <img
                                    src={
                                      order.orderItems[0]?.images[0].url ||
                                      "/api/placeholder/48/48"
                                    }
                                    alt="Product"
                                    className="w-full h-full object-cover"
                                     onError={(e) => {
                                  const target = e.target;
                                  if (target instanceof HTMLElement) {
                                    target.style.display = "none";

                                    const nextSibling = target.nextSibling;
                                    if (nextSibling instanceof HTMLElement) {
                                      nextSibling.style.display = "flex";
                                    }
                                  }
                                }}
                                  />
                                  <Package
                                    className="h-5 w-5 text-muted-foreground"
                                    style={{ display: "none" }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="space-y-1">
                                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                  {order._id.slice(-6)}
                                </code>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                            </td>
                            <td className="p-3 font-semibold text-gray-800">
                              ${order.totalPrice.toFixed(2)}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col space-y-1">
                                <StatusBadge status={order.isPaid} type="payment" />
                                <StatusBadge status={order.isDelivered} type="delivery"/>
                              </div>
                            </td>
                            <td className="p-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="hover:bg-red-50 hover:border-red-200"
                                onClick={() =>
                                  window.open(`/order/${order._id}`, "_self")
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {orders?.map((order: Order) => (
                <Card key={order._id} className="overflow-hidden shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                        <img
                          src={
                            order.orderItems[0]?.images[0].url ||
                            "/api/placeholder/64/64"
                          }
                          alt="Product"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                                  const target = e.target;
                                  if (target instanceof HTMLElement) {
                                    target.style.display = "none";

                                    const nextSibling = target.nextSibling;
                                    if (nextSibling instanceof HTMLElement) {
                                      nextSibling.style.display = "flex";
                                    }
                                  }
                                }}
                        />
                        <Package
                          className="h-6 w-6 text-muted-foreground"
                          style={{ display: "none" }}
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            #{order._id.slice(-6)}
                          </code>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg text-gray-800">
                            ${order.totalPrice.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                          <StatusBadge status={order.isPaid} type="payment" />
                          <StatusBadge status={order.isDelivered} type="delivery" />
                        </div>

                        <div className="pt-2">
                          <Button
                            size="sm"
                            className="w-full bg-red-500 hover:bg-red-600"
                            onClick={() =>
                              window.open(`/order/${order._id}`, "_self")
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
