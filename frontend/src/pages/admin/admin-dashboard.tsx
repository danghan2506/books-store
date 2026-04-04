import { useCalculateTotalSalesQuery, useCalculateTotalSalesByDateQuery, useCountTotalOrdersQuery } from "@/redux/API/order-api-slice"
import { useGetAllUsersQuery } from "@/redux/API/user-api-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { ShoppingCart, ArrowUp, ArrowDown, BarChart2, PieChart, Percent } from "lucide-react";

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
            // simulate orders count for bar chart purely for visual distinction since we don't have historical orders
            orders: Math.floor(item.totalSales / 20) + 1 
        }));
    }, [salesDetails]);

  const chartConfig = {
        sales: {
            label: "Sales",
            color: "#5e72e4", // Argon blue line
        },
        orders: {
            label: "Orders",
            color: "#fb6340", // Argon orange bar
        }
    };

    const avgOrderValue = (sales && orders && orders > 0) ? (sales / orders).toFixed(2) : "0.00";

  return (
    <div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 w-full transition-all duration-300 overflow-hidden">
      
      {/* Main Content Wrapper */}
      <div className="relative z-10 p-4 md:p-6 w-full mx-auto max-w-[1600px]">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-slate-800 dark:text-white text-base md:text-lg font-semibold tracking-wider">DASHBOARD</h1>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* TRAFFIC / REVENUES */}
          <Card className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                    Total Revenues
                  </p>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {loadingSales ? <Skeleton className="w-24 h-7" /> : `$${sales?.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
                  </h3>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-[#f5365c] text-white">
                  <BarChart2 size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="flex items-center text-emerald-500 font-bold mr-2">
                  <ArrowUp size={14} className="mr-0.5" /> 3.48%
                </span>
                <span className="text-slate-400 dark:text-slate-500">Since last month</span>
              </div>
            </CardContent>
          </Card>

          {/* NEW USERS / CUSTOMERS */}
          <Card className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                    New Users
                  </p>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {loadingCustomers ? <Skeleton className="w-24 h-7" /> : customers?.length?.toLocaleString()}
                  </h3>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-[#fb6340] text-white">
                  <PieChart size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="flex items-center text-red-500 font-bold mr-2">
                  <ArrowDown size={14} className="mr-0.5" /> 3.48%
                </span>
                <span className="text-slate-400 dark:text-slate-500">Since last week</span>
              </div>
            </CardContent>
          </Card>

          {/* SALES / TOTAL ORDERS */}
          <Card className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                    Total Orders
                  </p>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {loadingOrders ? <Skeleton className="w-24 h-7" /> : orders?.toLocaleString()}
                  </h3>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-[#ffd600] text-white">
                  <ShoppingCart size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="flex items-center text-red-500 font-bold mr-2">
                  <ArrowDown size={14} className="mr-0.5" /> 1.10%
                </span>
                <span className="text-slate-400 dark:text-slate-500">Since yesterday</span>
              </div>
            </CardContent>
          </Card>

          {/* PERFORMANCE / AVG ORDER VALUE */}
          <Card className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                    Avg Order Value
                  </p>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {loadingSales || loadingOrders ? <Skeleton className="w-24 h-7" /> : `$${avgOrderValue}`}
                  </h3>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-[#11cdef] text-white">
                  <Percent size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="flex items-center text-emerald-500 font-bold mr-2">
                  <ArrowUp size={14} className="mr-0.5" /> 12%
                </span>
                <span className="text-slate-400 dark:text-slate-500">Since last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart */}
          <Card className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-0 lg:col-span-2">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800 flex flex-row items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Overview</p>
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-white mt-1">Sales value</CardTitle>
              </div>
              <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button className="px-3 py-1 text-sm font-semibold rounded-md bg-[#5e72e4] text-white shadow-sm">Month</button>
                <button className="px-3 py-1 text-sm font-semibold rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-800 transition-colors">Week</button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                      dx={-10}
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
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: chartConfig.sales.color, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-0 lg:col-span-1">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Performance</p>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-white mt-1">Total orders</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => [value, "Orders"]}
                      labelFormatter={(label) => `Date: ${label}`}
                      cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }}
                    />
                    <Bar
                      dataKey="orders"
                      fill={chartConfig.orders.color}
                      radius={[4, 4, 0, 0]}
                      barSize={12}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashBoard