import asyncHandler from "../middlewares/async-handler.js";
import Book from "../models/books-model.js";
import { Order } from "../models/orders-model.js";
import calculatePrice from "../utils/orders.js";
const createOrder = asyncHandler(async(req, res) => {
    try {
        const {orderItems, shippingAddress, paymentMethod} = req.body
        const itemsFromDatabase = await Book.find({_id: {$in: orderItems.map((x) => x._id)}})
        const databaseOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDatabase = itemsFromDatabase.find((itemFromDatabase) => itemFromDatabase._id.toString() === itemFromClient._id)
            if(!matchingItemFromDatabase){
                res.status(404)
                throw new Error(`Product not found: ${itemFromClient._id}`)
            }
            return {
                ...itemFromClient,
                book: itemFromClient._id,
                price: matchingItemFromDatabase.price,
                _id: undefined
            }
        })
        const {itemsPrice, taxPrice, shippingPrice, totalPrice} = calculatePrice(databaseOrderItems)
        const order = new Order({
            orderItems: databaseOrderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    } catch (error) {
        console.error(error)
        res.status(500).json("server Error!")
    }
})
const getAllOrders = asyncHandler(async(req, res) => {
    try {
        const pageSize = 10
        const page = Number(req.query.page) || 1
        const count = await Order.countDocuments({});
        const orders = await Order.find({})
        .populate("user", "id username")
        .limit(pageSize)
        .skip(pageSize * (page - 1))

        const paidCount = await Order.countDocuments({ isPaid: true });
        const deliveredCount = await Order.countDocuments({ isDelivered: true });
        const pendingCount = count - paidCount;

        res.json({
            orders,
            page,
            pages: Math.ceil(count / pageSize),
            hasMore: page < Math.ceil(count / pageSize),
            paidCount,
            deliveredCount,
            pendingCount,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json("Server error!")
    }
})
const getUserOrders = asyncHandler(async(req, res) => {
    try {
        const orders = await Order.find({user: req.user._id})
        if(!orders){
            res.status(404).json("No order found!")
        }
        else{
            res.json(orders)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json("Server error!")
    }
})
const countTotalOrders = asyncHandler(async(req, res) => {
    try {
        const totalOrders = await Order.countDocuments()
        res.json(totalOrders)
    } catch (error) {
        console.error(error)
        res.status(500).json("Server error!")
    }

})
const calculateTotalSales = asyncHandler(async(req, res) => {
    try {
        const orders = await Order.find()
        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0)
        res.json(totalSales)
    } catch (error) {
        console.error(error)
        res.status(500).json("Server error!")
    }
})
const getOrderById = asyncHandler(async(req, res) => {
    try {
        const {orderId} = req.params
        const orders = await Order.findById(orderId).populate("user", "username email")
        if(!orders){
            res.status(404).json("No order found!")
        }
        else{
            res.json(orders)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json("Server error!")
    }
})
const calculateTotalSalesByDate = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12

    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    const salesByDate = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear }
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { 
            $sum: {
              $cond: [{ $eq: ["$isPaid", true] }, "$totalPrice", 0]
            } 
          },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Zero-filling
    const maxMonths = year === currentYear ? currentMonth : 12;
    const formattedData = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 1; i <= maxMonths; i++) {
      const foundData = salesByDate.find(item => item._id === i);
      formattedData.push({
        _id: monthNames[i - 1], // frontend uses _id for the axis
        totalSales: foundData ? foundData.totalSales : 0,
        totalOrders: foundData ? foundData.totalOrders : 0
      });
    }

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const markOrderAsPaid = asyncHandler(async(req, res) => {
    const {orderId} = req.params
    try {
        const order = await Order.findById(orderId)
        if (!order) {
            res.status(404);
            throw new Error("Order not found");
        }

        // Prevent double processing if already paid
        if (order.isPaid) {
            return res.status(200).json(order)
        }

        // For PayPal orders, payment is handled by PayPal, mark as paid automatically
        // For CoD orders, admin manually marks as paid
        order.isPaid = true;
        order.paidAt = Date.now();
        
        // Only set paymentResult if details are provided (PayPal callback)
        if (req.body.id || req.body.status) {
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer?.email_address,
            };
        }

        const updatedOrder = await order.save()

        // Decrement stock and increment salesCount for each purchased book by the quantity bought
        // Only do this once when payment is first marked as paid
        if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
            try {
                await Promise.all(
                    order.orderItems.map((item) =>
                        Book.updateOne(
                            { _id: item.book },
                            { 
                                $inc: { 
                                    salesCount: item.quantity ?? 1,
                                    stock: -(item.quantity ?? 1)
                                } 
                            }
                        )
                    )
                )
            } catch (stockError) {
                console.error("Stock update error:", stockError);
                // Log but don't fail - payment is already processed
                // In production, you might want to trigger an alert or manual review
            }
        }

        return res.status(201).json(updatedOrder)
    } catch (error) {
        console.error(error)
        res.status(500).json("Server error!")
    }
})
const markOrderAsDelivered = asyncHandler(async(req, res) => {
    try {
        const {orderId} = req.params
        const order = await Order.findById(orderId)
        if(!order){
            res.status(404)
            throw new Error("Order not found")
        }
        
        // Prevent marking as delivered if not yet paid, unless it's Cash on Delivery
        if (!order.isPaid && order.paymentMethod !== "Cash on Delivery") {
            res.status(400)
            throw new Error("Order must be paid before marking as delivered")
        }
        
        // Prevent double processing if already delivered
        if (order.isDelivered) {
            return res.status(200).json(order)
        }
        
        order.isDelivered = true
        order.deliveredAt = Date.now()
        
        const updateOrder = await order.save()
        res.status(201).json(updateOrder)
    } catch (error) {
        console.error(error)
        res.status(500).json("Server error!")
    }
})

const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  
  // Start of this month
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfYesterday = new Date(now);
  startOfYesterday.setDate(now.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  // 1. Revenues and Avg Order Value (Sales this month vs last month)
  const thisMonthData = await Order.aggregate([
    { $match: { createdAt: { $gte: startOfThisMonth } } },
    { $group: { 
        _id: null, 
        totalSales: { $sum: { $cond: [{ $eq: ["$isPaid", true] }, "$totalPrice", 0] } }, 
        totalOrders: { $sum: 1 },
        totalPaidOrders: { $sum: { $cond: [{ $eq: ["$isPaid", true] }, 1, 0] } }
      } 
    }
  ]);
  
  const lastMonthData = await Order.aggregate([
    { $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
    { $group: { 
        _id: null, 
        totalSales: { $sum: { $cond: [{ $eq: ["$isPaid", true] }, "$totalPrice", 0] } }, 
        totalOrders: { $sum: 1 },
        totalPaidOrders: { $sum: { $cond: [{ $eq: ["$isPaid", true] }, 1, 0] } }
      } 
    }
  ]);

  const thisMonthSales = thisMonthData.length > 0 ? thisMonthData[0].totalSales : 0;
  const lastMonthSales = lastMonthData.length > 0 ? lastMonthData[0].totalSales : 0;
  const thisMonthOrdersPaid = thisMonthData.length > 0 ? thisMonthData[0].totalPaidOrders : 0;
  const lastMonthOrdersPaid = lastMonthData.length > 0 ? lastMonthData[0].totalPaidOrders : 0;
  
  let salesPercentage = 0;
  if (lastMonthSales > 0) salesPercentage = ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100;
  else if (thisMonthSales > 0) salesPercentage = 100;

  const thisMonthAvg = thisMonthOrdersPaid > 0 ? thisMonthSales / thisMonthOrdersPaid : 0;
  const lastMonthAvg = lastMonthOrdersPaid > 0 ? lastMonthSales / lastMonthOrdersPaid : 0;
  let avgPercentage = 0;
  if (lastMonthAvg > 0) avgPercentage = ((thisMonthAvg - lastMonthAvg) / lastMonthAvg) * 100;
  else if (thisMonthAvg > 0) avgPercentage = 100;

  // 2. Orders (Today vs Yesterday)
  const todayOrdersTotal = await Order.countDocuments({
    createdAt: { $gte: startOfToday }
  });
  
  const yesterdayOrdersTotal = await Order.countDocuments({
    createdAt: { $gte: startOfYesterday, $lt: startOfToday }
  });

  let ordersPercentage = 0;
  if (yesterdayOrdersTotal > 0) ordersPercentage = ((todayOrdersTotal - yesterdayOrdersTotal) / yesterdayOrdersTotal) * 100;
  else if (todayOrdersTotal > 0) ordersPercentage = 100;

  // 3. Overall Totals for the stats
  const allTimeSalesData = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
  ]);
  const allTimeSales = allTimeSalesData.length > 0 ? allTimeSalesData[0].totalSales : 0;
  const allTimeOrders = await Order.countDocuments();
  
  res.json({
    sales: {
      total: allTimeSales,
      percentage: parseFloat(salesPercentage.toFixed(2))
    },
    orders: {
      total: allTimeOrders,
      percentage: parseFloat(ordersPercentage.toFixed(2))
    },
    avg: {
      percentage: parseFloat(avgPercentage.toFixed(2))
    }
  });
});

export {createOrder, getAllOrders, getOrderById, getUserOrders, countTotalOrders, calculateTotalSales, calculateTotalSalesByDate, markOrderAsDelivered, markOrderAsPaid, getDashboardStats}