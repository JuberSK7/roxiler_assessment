const axios = require("axios");
const Transaction = require("../models/Transaction");


const initializeDatabase = async (req, res) => {
  try {
    console.log("Initializing database...");
    const { data } = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    console.log("Fetched data successfully:", data);

    
    if (!Array.isArray(data)) {
      throw new Error("Fetched data is not an array.");
    }

 
    await Transaction.deleteMany({});

  
    await Transaction.insertMany(data);

    console.log("Database initialized successfully.");
    res.status(200).send({ message: "Database initialized successfully" });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    res.status(500).send({ message: "Failed to initialize database", error });
  }
};

const listTransactions = async (req, res) => {
  const { month, page = 1, perPage = 10, search = "" } = req.query;

  try {
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    console.log('Start date:', start.toISOString());
    console.log('End date:', end.toISOString());

    const query = {
      dateOfSale: { $gte: start, $lt: end },
      $or: [
        { productName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

  
    
console.log('query', query )
    const transactions = await Transaction.find({dateOfSale: { $gte: start, $lt: end },  $or: [
      { productName: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],})
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

  
    res.status(200).json(transactions);
    // console.log(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error); // Detailed logging
    res.status(500).send({ message: "Failed to fetch transactions", error: error.message });
  }
};


const getStatistics = async (req, res) => {
  const { month } = req.params;
  const start = new Date(`${month} 1, 2021`);
  const end = new Date(`${month} 1, 2021`);
  end.setMonth(end.getMonth() + 1);

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lt: end }, sold: true } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: start, $lt: end },
      sold: true,
    });
    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: start, $lt: end },
      sold: false,
    });

    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch statistics", error });
  }
};

const getBarChartData = async (req, res) => {
  const { month } = req.params;
  const start = new Date(`${month} 1, 2021`);
  const end = new Date(`${month} 1, 2021`);
  end.setMonth(end.getMonth() + 1);

  const ranges = [
    { range: "0 - 100", min: 0, max: 100 },
    { range: "101 - 200", min: 101, max: 200 },
    { range: "201 - 300", min: 201, max: 300 },
    { range: "301 - 400", min: 301, max: 400 },
    { range: "401 - 500", min: 401, max: 500 },
    { range: "501 - 600", min: 501, max: 600 },
    { range: "601 - 700", min: 601, max: 700 },
    { range: "701 - 800", min: 701, max: 800 },
    { range: "801 - 900", min: 801, max: 900 },
    { range: "901-above", min: 901, max: Infinity },
  ];

  try {
    const barChartData = await Promise.all(
      ranges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          dateOfSale: { $gte: start, $lt: end },
          price: { $gte: min, $lt: max },
        });
        return { range, count };
      })
    );
    res.status(200).json(barChartData);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch bar chart data", error });
  }
};

const getPieChartData = async (req, res) => {
  const { month } = req.params;
  const start = new Date(`${month} 1, 2021`);
  const end = new Date(`${month} 1, 2021`);
  end.setMonth(end.getMonth() + 1);

  try {
    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res
      .status(200)
      .json(pieChartData.map(({ _id, count }) => ({ category: _id, count })));
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch pie chart data", error });
  }
};

const getCombinedData = async (req, res) => {
  const { month } = req.params;

  try {
    const [statistics, barChartData, pieChartData] = await Promise.all([
      getStatistics({ params: { month } }, res),
      getBarChartData({ params: { month } }, res),
      getPieChartData({ params: { month } }, res),
    ]);

    res.status(200).json({ statistics, barChartData, pieChartData });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch combined data", error });
  }
};

module.exports = {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData,
};
