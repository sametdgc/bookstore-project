import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { getRevenueByCategory } from "../../../../services/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF6363"];

const RevenueByCategoryChart = () => {
  const [revenueByCategory, setRevenueByCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRevenueByCategory();
      console.log(data);
      setRevenueByCategory(data);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Revenue by Category (Genre)</h2>
      {revenueByCategory.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={revenueByCategory}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="revenue"
              nameKey="category"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {revenueByCategory.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No revenue data available.</p>
      )}
    </div>
  );
};

export default RevenueByCategoryChart;
