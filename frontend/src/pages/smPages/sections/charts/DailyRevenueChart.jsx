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
import { getDailyRevenue } from "../../../../services/api";
import { useSearchParams } from "react-router-dom";

const DailyRevenueChart = () => {
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [filteredRevenue, setFilteredRevenue] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const startDateQuery = searchParams.get("startDate") || "";
  const endDateQuery = searchParams.get("endDate") || "";

  const [startDateInput, setStartDateInput] = useState(startDateQuery);
  const [endDateInput, setEndDateInput] = useState(endDateQuery);

  // Load revenue data
  useEffect(() => {
    const loadDailyRevenue = async () => {
      const revenueData = await getDailyRevenue();
      setDailyRevenue(revenueData);
      applyFilters(revenueData, startDateQuery, endDateQuery);
    };
    loadDailyRevenue();
  }, []);

  // Update filters when searchParams or revenue data changes
  useEffect(() => {
    applyFilters(dailyRevenue, startDateQuery, endDateQuery);
  }, [searchParams, dailyRevenue]);

  const applyFilters = (revenueData, startDate, endDate) => {
    const filtered = revenueData.filter((revenue) => {
      const revenueDate = new Date(revenue.date);
      const start = startDate && !isNaN(new Date(startDate)) ? new Date(startDate) : null;
      const end = endDate && !isNaN(new Date(endDate)) ? new Date(endDate) : null;

      return (!start || revenueDate >= start) && (!end || revenueDate <= end);
    });
    setFilteredRevenue(filtered);
  };

  const handleFilter = () => {
    setSearchParams({ startDate: startDateInput, endDate: endDateInput });
  };

  return (
    <div className="w-full p-4">
      {/* Date Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div>
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDateInput}
            onChange={(e) => setStartDateInput(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            value={endDateInput}
            onChange={(e) => setEndDateInput(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-[#65aa92] text-white rounded-md hover:bg-green-600 transition"
        >
          Filter
        </button>
      </div>

      {/* Chart */}
      <div className="w-full p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">Daily Revenue Chart</h2>
        {filteredRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={filteredRevenue}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#65aa92" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No revenue data for the selected dates.</p>
        )}
      </div>
    </div>
  );
};

export default DailyRevenueChart;