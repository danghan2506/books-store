import { useGetAllOrdersQuery, usePayOrderMutation, useDeliverOrderMutation } from "@/redux/API/order-api-slice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Package, Eye, AlertCircle, ShoppingBag, Clock, CheckCircle2, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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

const isCoDbOrder = (paymentMethod: string): boolean => {
  return paymentMethod === "Cash on Delivery";
};

const getPaymentBadge = (isPaid: boolean) => {
  if (isPaid) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-600/10 dark:ring-emerald-400/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 ring-1 ring-amber-600/10 dark:ring-amber-400/20">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Pending
    </span>
  );
};

const getDeliveryBadge = (isDelivered: boolean) => {
  if (isDelivered) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 ring-1 ring-blue-600/10 dark:ring-blue-400/20">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        Delivered
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 ring-1 ring-slate-300/50 dark:ring-slate-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Pending
    </span>
  );
};

const getMethodBadge = (paymentMethod: string) => {
  if (paymentMethod === "PayPal") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.603c-.463 0-.855.334-.929.788l-1.597 9.218z"/>
        </svg>
        PayPal
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
      <Truck className="w-3 h-3" />
      COD
    </span>
  );
};

export const OrdersTable = ({ isDashboard = false }: OrdersTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allOrders, isLoading, error, refetch } = useGetAllOrdersQuery({ page: currentPage });

  const [payOrder] = usePayOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePaymentStatusChange = async (orderId: string, value: string) => {
    try {
      await payOrder({ orderId, details: { status: value } }).unwrap();
      await refetch();
      toast.success("Payment status updated successfully");
    } catch (err) {
      console.error("Error updating payment status:", err);
      toast.error("Failed to update payment status. Please try again.");
    }
  };

  const handleDeliveryStatusChange = async (orderId: string, value: string) => {
    try {
      await deliverOrder({ orderId, details: { status: value } }).unwrap();
      await refetch();
      toast.success("Delivery status updated successfully");
    } catch (err) {
      console.error("Error updating delivery status:", err);
      toast.error("Failed to update delivery status. Please try again.");
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

  // Use total stats from API (across all pages)
  const paidCount = allOrders?.paidCount ?? 0;
  const deliveredCount = allOrders?.deliveredCount ?? 0;
  const pendingCount = allOrders?.pendingCount ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
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
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-full mb-5">
          <Package className="h-10 w-10 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No orders yet</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center text-sm max-w-sm">
          Orders will appear here as customers place them. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mini Stats */}
      {!isDashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{paidCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Paid Orders</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10">
              <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{deliveredCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Delivered</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-500/10">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{pendingCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Payment</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-slate-200/80 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Product</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Order ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Total</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Payment</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Delivery</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Method</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/50">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="group hover:bg-blue-50/40 dark:hover:bg-slate-700/20 transition-colors duration-150"
                >
                  <td className="px-5 py-4">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center ring-1 ring-slate-200/80 dark:ring-slate-600/50">
                      <img
                        src={order.orderItems[0]?.images?.[0]?.url || "/api/placeholder/44/44"}
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
                      <Package className="h-4 w-4 text-slate-400" style={{ display: "none" }} />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-xs bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md font-mono text-slate-600 dark:text-slate-300">
                      #{order._id.slice(-8)}
                    </code>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    {isCoDbOrder(order.paymentMethod) && !order.isPaid ? (
                      <NativeSelect
                        size="sm"
                        value={order.isPaid ? "paid" : "pending"}
                        onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                      >
                        <NativeSelectOption value="pending">⏳ Pending</NativeSelectOption>
                        <NativeSelectOption value="paid">✓ Paid</NativeSelectOption>
                      </NativeSelect>
                    ) : (
                      getPaymentBadge(order.isPaid)
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {!order.isDelivered && (order.isPaid || isCoDbOrder(order.paymentMethod)) ? (
                      <NativeSelect
                        size="sm"
                        value={order.isDelivered ? "delivered" : "pending"}
                        onChange={(e) => handleDeliveryStatusChange(order._id, e.target.value)}
                      >
                        <NativeSelectOption value="pending">⏳ Pending</NativeSelectOption>
                        <NativeSelectOption value="delivered">✓ Delivered</NativeSelectOption>
                      </NativeSelect>
                    ) : (
                      getDeliveryBadge(order.isDelivered)
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {getMethodBadge(order.paymentMethod)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="cursor-pointer h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 transition-colors duration-150"
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
          <div
            key={order._id}
            className="bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 rounded-xl p-4 space-y-3 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => window.open(`/admin/order/${order._id}`, "_self")}
          >
            <div className="flex gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center ring-1 ring-slate-200/80 dark:ring-slate-600/50 flex-shrink-0">
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
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <code className="text-xs bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-md font-mono text-slate-600 dark:text-slate-300">
                    #{order._id.slice(-8)}
                  </code>
                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                  {getMethodBadge(order.paymentMethod)}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {getPaymentBadge(order.isPaid)}
                  {getDeliveryBadge(order.isDelivered)}
                </div>

                {/* Action selects for editable statuses */}
                {(isCoDbOrder(order.paymentMethod) && !order.isPaid) || (!order.isDelivered && (order.isPaid || isCoDbOrder(order.paymentMethod))) ? (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 space-y-2" onClick={(e) => e.stopPropagation()}>
                    {isCoDbOrder(order.paymentMethod) && !order.isPaid && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Payment:</span>
                        <NativeSelect
                          size="sm"
                          value={order.isPaid ? "paid" : "pending"}
                          onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                          className="w-28"
                        >
                          <NativeSelectOption value="pending">Pending</NativeSelectOption>
                          <NativeSelectOption value="paid">Paid</NativeSelectOption>
                        </NativeSelect>
                      </div>
                    )}
                    {!order.isDelivered && (order.isPaid || isCoDbOrder(order.paymentMethod)) && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Delivery:</span>
                        <NativeSelect
                          size="sm"
                          value={order.isDelivered ? "delivered" : "pending"}
                          onChange={(e) => handleDeliveryStatusChange(order._id, e.target.value)}
                          className="w-28"
                        >
                          <NativeSelectOption value="pending">Pending</NativeSelectOption>
                          <NativeSelectOption value="delivered">Delivered</NativeSelectOption>
                        </NativeSelect>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-2">
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
                    <span className="flex h-9 w-9 items-center justify-center text-slate-400">...</span>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                Orders Management
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                View and manage all customer orders
              </p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable isDashboard={false} />
      </div>
    </div>
  );
};

export default OrdersList;
