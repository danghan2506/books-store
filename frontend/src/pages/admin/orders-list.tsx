import React from 'react'
import { useGetAllOrdersQuery } from '@/redux/API/order-api-slice'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Package, Eye } from "lucide-react";
const OrdersList = () => {
    const {data: allOrders, isLoading, error} = useGetAllOrdersQuery()
    const formatDate = (dateString) => {
    return new Date(dateString).toISOString().substring(0, 10);
  };
  const StatusBadge = ({ status } ) => {
    const variant = status ? 'default' : 'destructive';
    const className = status 
      ? 'bg-green-100 text-green-800 hover:bg-green-100' 
      : 'bg-red-100 text-red-800 hover:bg-red-100';
    
    return (
      <Badge variant={variant} className={className}>
        {status ? 'Completed' : 'Pending'}
      </Badge>
    );
  };
  if (isLoading) {
    return (
     <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Orders</h1>
        <Alert variant="destructive">
          <AlertDescription>
            {error?.data?.error || error?.error || 'An error occurred while loading your orders'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">All Orders</h1>
      </div>

      {allOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-semibold">Product</th>
                        <th className="text-left p-4 font-semibold">Order ID</th>
                        <th className="text-left p-4 font-semibold">Date</th>
                        <th className="text-left p-4 font-semibold">Total</th>
                        <th className="text-left p-4 font-semibold">Payment</th>
                        <th className="text-left p-4 font-semibold">Delivery</th>
                        <th className="text-left p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrders.map((order, index) => (
                        <tr 
                          key={order._id} 
                          className={`border-b transition-colors hover:bg-muted/30 ${
                            index === allOrders.length - 1 ? 'border-b-0' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                              <img
                                src={order.orderItems[0]?.images[0].url || '/api/placeholder/64/64'}
                                alt="Product"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <Package className="h-6 w-6 text-muted-foreground" style={{display: 'none'}} />
                            </div>
                          </td>
                          <td className="p-4">
                            <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                              {order._id}
                            </code>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="p-4 font-semibold">
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
                              onClick={() => window.open(`/order/${order._id}`, '_self')}
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {allOrders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                      <img
                        src={order.orderItems[0]?.image || '/api/placeholder/64/64'}
                        alt="Product"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <Package className="h-6 w-6 text-muted-foreground" style={{display: 'none'}} />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {order._id.slice(-8)}
                        </code>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <StatusBadge status={order.isPaid} type="payment" />
                        <StatusBadge status={order.isDelivered} type="delivery" />
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open(`/order/${order._id}`, '_self')}
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
  )
}

export default OrdersList