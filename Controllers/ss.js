const expressAsyncHandler = require("express-async-handler");
const { Order } = require("../models/Order");

module.exports.getStatisticsOfLaundry = expressAsyncHandler(async(req, res) => {
    
// Get the current date
const currentDate = new Date();

// Set the date to the first day of the current month
const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

// Calculate the start date of last week (7 days ago)
const lastWeekStart = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));

// Calculate the end date of last week (today at midnight)
const lastWeekEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
lastWeekEnd.setHours(0, 0, 0, 0); // Set time to midnight

// Find documents created after the first of the current month
const finishedOrdersThisMOnth = await Order.find({createdAt: { $gt: firstOfMonth }, status:'done' })
const finishedOrdersLastWeek = await Order.find({createdAt: {$gt: lastWeekStart,$lt: lastWeekEnd}, status:'done' })

lastWeekIncome = finishedOrdersLastWeek.reduce((acc, curr) => {
    return acc.cost + curr.cost
})

thisMonthIncome = finishedOrdersThisMOnth.reduce((acc, curr) => {
    return acc.cost + curr.cost
})


const statistics = {
    lastWeekOrders : finishedOrdersLastWeek.length,
    lastWeekIncome: lastWeekIncome,
    thisMonthOrders: finishedOrdersThisMOnth.length,
    thisMonthIncome: thisMonthIncome
}

return res.status(200).json(statistics)

})