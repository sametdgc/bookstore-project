import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getBestSellingBooksComposition } from "../../../../services/api";

const BestSellingBooksChart = () => {
  const [bestSellingBooks, setBestSellingBooks] = useState([]);

  useEffect(() => {
    const fetchBestSellingBooks = async () => {
      const data = await getBestSellingBooksComposition();
      setBestSellingBooks(data);
    };

    fetchBestSellingBooks();
  }, []);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Best-Selling Books</h2>
      {bestSellingBooks.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical" // Use vertical layout for readability
            data={bestSellingBooks}
            margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="title" type="category" width={150} />
            <Tooltip formatter={(value) => `$${value}`} />
            <Bar dataKey="revenue" fill="#65aa92" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No data available for best-selling books.</p>
      )}
    </div>
  );
};

export default BestSellingBooksChart;
