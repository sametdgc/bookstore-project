import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { getRevenueByCategory, getProfitByCategory, getCostByCategory } from "../../../../services/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF6363"];

const RevenueByCategoryChart = () => {
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [profitByCategory, setProfitByCategory] = useState([]);
  const [costByCategory, setCostByCategory] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const revenueData = await getRevenueByCategory();
      const profitData = await getProfitByCategory();
      const costData = await getCostByCategory();

      setRevenueByCategory(revenueData);
      setProfitByCategory(profitData);
      setCostByCategory(costData);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Profit by Category</h2>
      {profitByCategory.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={profitByCategory}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="profit"
              nameKey="category"
              //label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {profitByCategory.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No profit data available.</p>
      )}

      <div className="p-8"></div>

      <h2 className="text-xl font-semibold mb-4 text-center">Cost by Category</h2>
      {costByCategory.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={costByCategory}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="cost"
              nameKey="category"
              //label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {costByCategory.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No cost data available.</p>
      )}

      <div className="p-8"></div>

      <h2 className="text-xl font-semibold mb-4 text-center">Revenue by Category(Genre)</h2>
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
              //label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
