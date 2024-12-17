import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getDailyTotalRevenue } from "../../../../services/api";
import { useSearchParams } from "react-router-dom";

const TotalRevenueChart = () => {
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Read date range from URL params
  const startDateQuery = searchParams.get("startDate") || "";
  const endDateQuery = searchParams.get("endDate") || "";

  const [startDateInput, setStartDateInput] = useState(startDateQuery);
  const [endDateInput, setEndDateInput] = useState(endDateQuery);

  // Fetch revenue data
  useEffect(() => {
    const fetchDailyRevenue = async () => {
      const data = await getDailyTotalRevenue(startDateQuery, endDateQuery);
      setDailyRevenue(data);
    };

    fetchDailyRevenue();
  }, [startDateQuery, endDateQuery]);

  // Update URL when filters are applied
  const handleFilter = () => {
    setSearchParams({ startDate: startDateInput, endDate: endDateInput });
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Daily Revenue Over Time</h2>

      {/* Date Filter */}
      <div className="flex items-center space-x-4 mb-6 justify-center">
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

      {/* Line Chart */}
      <div className="w-full">
        {dailyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#65aa92"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No revenue data for the selected range.</p>
        )}
      </div>
    </div>
  );
};

export default TotalRevenueChart;
