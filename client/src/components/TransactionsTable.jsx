import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTransactions = async () => {
    console.log({params:{month: selectedMonth, search: searchText, page: currentPage}})
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions`, {
        params: { month: selectedMonth, search: searchText, page: currentPage },
      });
      console.log('API response:', response.data); 
      setTransactions(response.data);
  
    } catch (error) {
      console.error('Error fetching transactions:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };
  // console.log('transactipons', transactions)
  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, searchText, currentPage]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search transactions"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id}>
              <td>{transaction.productName}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
      <button onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
    </div>
  );
};

export default TransactionsTable;
