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

// Function to truncate titles if too long
const truncateTitle = (title, maxLength = 20) => {
  if (title.length > maxLength) {
    return title.substring(0, maxLength) + "...";
  }
  return title;
};

const BestSellingBooksChart = () => {
  const [bestSellingBooks, setBestSellingBooks] = useState([]);

  useEffect(() => {
    const fetchBestSellingBooks = async () => {
      const data = await getBestSellingBooksComposition();
      // Sort by revenue and take the top 15
      const topBooks = data.sort((a, b) => b.revenue - a.revenue).slice(0, 15);
      setBestSellingBooks(topBooks);
    };

    fetchBestSellingBooks();
  }, []);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Top 15 Best-Selling Books</h2>
      {bestSellingBooks.length > 0 ? (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            layout="vertical"
            data={bestSellingBooks}
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="title"
              type="category"
              width={200}
              tickFormatter={(title) => truncateTitle(title)}
            />
            <Tooltip
              formatter={(value) => `$${value}`}
              labelFormatter={(label) => `Title: ${label}`}
            />
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
