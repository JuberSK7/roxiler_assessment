const express = require('express');
const {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData,
} = require('../controllers/transactionController');

const router = express.Router();


/// All api path Routers
router.get('/initialize', initializeDatabase);
router.get('/transactions', listTransactions);
router.get('/statistics/:month', getStatistics);
router.get('/bar-chart/:month', getBarChartData);
router.get('/pie-chart/:month', getPieChartData);
router.get('/combined/:month', getCombinedData);

module.exports = router;




