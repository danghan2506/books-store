import { useGetAllOrdersQuery, usePayOrderMutation, useDeliverOrderMutation } from "@/redux/API/order-api-slice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Package, Eye, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { Order } from "@/types/order-type";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface OrdersTableProps {
  isDashboard?: boolean;
}

const isPayPalOrder = (paymentMethod: string): boolean => {
  return paymentMethod?.toUpperCase?.() === "PAYPAL";
};

const isCoDbOrder = (paymentMethod: string): boolean => {
  return paymentMethod?.toUpperCase?.() === "COD";
};

export const OrdersTable = ({ isDashboard = false }: OrdersTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allOrders, isLoading, error, refetch } = useGetAllOrdersQuery({ page: currentPage });

  const [payOrder] = usePayOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toISOString().substring(0, 10);
  };

  const handlePaymentStatusChange = async (orderId: string, value: string) => {
    try {
      await payOrder({ orderId, details: { status: value } }).unwrap();
      await refetch();
    } catch (err) {
      console.error("Error updating payment status:", err);
      alert("Failed to update payment status. Please try again.");
    }
  };

  const handleDeliveryStatusChange = async (orderId: string, value: string) => {
    try {
      await deliverOrder({ orderId, details: { status: value } }).unwrap();
      await refetch();
    } catch (err) {
      console.error("Error updating delivery status:", err);
      alert("Failed to update delivery status. Please try again.");
    }
  };

  const orders = (allOrders?.orders || []) as Order[];
  const totalPages = allOrders?.pages || 1;
  const hasMore = allOrders?.hasMore || false;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (!isDashboard) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load orders. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
          <Package className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No orders yet</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center text-sm">
          Orders will appear here as customers place them
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">Order ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">Delivery</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">Method</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <img
                        src={order.orderItems[0]?.images?.[0]?.url || "/api/placeholder/48/48"}
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
                      <Package className="h-5 w-5 text-slate-400" style={{ display: "none" }} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-slate-700 dark:text-slate-300">
                      {order._id.slice(0, 8)}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <NativeSelect
                      size="sm"
                      disabled={isPayPalOrder(order.paymentMethod) || !isCoDbOrder(order.paymentMethod)}
                      value={order.isPaid ? "paid" : "pending"}
                      onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                    >
                      <NativeSelectOption value="pending">Pending</NativeSelectOption>
                      <NativeSelectOption value="paid">Paid</NativeSelectOption>
                    </NativeSelect>
                  </td>
                  <td className="px-4 py-3">
                    <NativeSelect
                      size="sm"
                      disabled={!order.isPaid}
                      value={order.isDelivered ? "delivered" : "pending"}
                      onChange={(e) => handleDeliveryStatusChange(order._id, e.target.value)}
                    >
                      <NativeSelectOption value="pending">Pending</NativeSelectOption>
                      <NativeSelectOption value="delivered">Delivered</NativeSelectOption>
                    </NativeSelect>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="cursor-pointer"
                      onClick={() => window.open(`/admin/order/${order._id}`, "_self")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600 flex-shrink-0">
                <img
                  src={order.orderItems[0]?.images?.[0]?.url || "/api/placeholder/56/56"}
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
                <Package className="h-5 w-5 text-slate-400" style={{ display: "none" }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono text-slate-700 dark:text-slate-300">
                    {order._id.slice(0, 8)}
                  </code>
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  ${order.totalPrice.toFixed(2)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Payment:</span>
                    <NativeSelect
                      size="sm"
                      disabled={isPayPalOrder(order.paymentMethod) || !isCoDbOrder(order.paymentMethod)}
                      value={order.isPaid ? "paid" : "pending"}
                      onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                      className="w-24"
                    >
                      <NativeSelectOption value="pending">Pending</NativeSelectOption>
                      <NativeSelectOption value="paid">Paid</NativeSelectOption>
                    </NativeSelect>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Delivery:</span>
                    <NativeSelect
                      size="sm"
                      disabled={!order.isPaid}
                      value={order.isDelivered ? "delivered" : "pending"}
                      onChange={(e) => handleDeliveryStatusChange(order._id, e.target.value)}
                      className="w-24"
                    >
                      <NativeSelectOption value="pending">Pending</NativeSelectOption>
                      <NativeSelectOption value="delivered">Delivered</NativeSelectOption>
                    </NativeSelect>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {order.paymentMethod}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="cursor-pointer"
                      onClick={() => window.open(`/admin/order/${order._id}`, "_self")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <span className="flex h-9 w-9 items-center justify-center">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => hasMore && handlePageChange(currentPage + 1)}
                  className={!hasMore ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

const OrdersList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">Orders Management</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">View and manage all customer orders</p>
            </div>
          </div>
        </div>

        {/* Orders Table Card */}
        <Card className="bg-white dark:bg-slate-900 shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-slate-900 dark:text-slate-50">All Orders</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Complete list of customer orders with payment and delivery status</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <OrdersTable isDashboard={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdersList;
