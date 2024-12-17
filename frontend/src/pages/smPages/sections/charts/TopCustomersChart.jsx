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
import { getTopCustomers } from "../../../../services/api";

const TopCustomersChart = () => {
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    const fetchTopCustomers = async () => {
      const data = await getTopCustomers();
      setTopCustomers(data);
    };

    fetchTopCustomers();
  }, []);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Top Customers</h2>
      {topCustomers.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topCustomers} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-45} // Tilt the labels 45 degrees
              textAnchor="end" // Align text properly when tilted
              interval={0} // Show all labels
              height={60} // Add extra space for tilted labels
            />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Bar dataKey="revenue" fill="#65aa92" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No customer data available.</p>
      )}
    </div>
  );
};

export default TopCustomersChart;
