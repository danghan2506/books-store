import { useCalculateTotalSalesQuery, useCalculateTotalSalesByDateQuery, useCountTotalOrdersQuery } from "@/redux/API/order-api-slice"
import { useGetAllUsersQuery } from "@/redux/API/user-api-slice"
import {CardHeader,  Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import OrdersList from "./orders-list";
const AdminDashBoard = () => {
    const {data: sales, isLoading: loadingSales} = useCalculateTotalSalesQuery()
    const {data: customers, isLoading: loadingCustomers} = useGetAllUsersQuery()
    const { data: orders, isLoading: loadingOrders } = useCountTotalOrdersQuery();
    const {data: salesDetails} = useCalculateTotalSalesByDateQuery()
   const chartData = useMemo(() => {
        if (!salesDetails || !Array.isArray(salesDetails)) return [];
        return salesDetails.map((item) => ({
            date: item._id,
            sales: item.totalSales,
        }));
    }, [salesDetails]);
  const chartConfig = {
        sales: {
            label: "Sales",
            color: "#00E396",
        },
    };
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:ml-[160px] xl:ml-[60px] lg:pr-2 xl:pr-4 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-4">
            <CardTitle className="text-blue-100">Total Revenues</CardTitle>
            <div className="text-2xl font-bold mt-2">
              {loadingSales ? <Skeleton className="w-20 h-6" /> : `$${sales}`}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-4">
            <CardTitle className="text-emerald-100">Subscription</CardTitle>
            <div className="text-2xl font-bold mt-2">
              {loadingCustomers ? <Skeleton className="w-20 h-6" /> : customers?.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-4">
            <CardTitle className="text-purple-100">Orders</CardTitle>
            <div className="text-2xl font-bold mt-2">
              {loadingOrders ? <Skeleton className="w-20 h-6" /> : orders}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="text-gray-800">Sales Trend</CardTitle>
                    <CardDescription>
                        Daily sales performance overview
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px]">
                        <LineChart data={chartData}>
                            <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <ChartTooltip 
                                content={<ChartTooltipContent />}
                                formatter={(value) => [`$${value}`, "Sales"]}
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="sales" 
                                stroke={chartConfig.sales.color}
                                strokeWidth={2}
                                dot={{ fill: chartConfig.sales.color, strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: chartConfig.sales.color }}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Orders</h2>
        <OrdersList/>
      </div>
    </div>
  );
}

export default AdminDashBoard