import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client";
import { scaleLinear } from "d3-scale";

const GeographicRevenueChart = () => {
  const [geoData, setGeoData] = useState(null);
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    const fetchAndConvertData = async () => {
      try {
        const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
        const worldData = await response.json();

        // Convert TopoJSON to GeoJSON
        const geoJson = feature(worldData, worldData.objects.countries);

        // Example Revenue Data
        const revenueData = [
          { name: "United States of America", revenue: 50000 },
          { name: "Canada", revenue: 30000 },
          { name: "Brazil", revenue: 20000 },
          { name: "United Kingdom", revenue: 40000 },
          { name: "India", revenue: 25000 },
          { name: "China", revenue: 60000 },
          { name: "Australia", revenue: 35000 },
          { name: "Turkey", revenue: 150000 },
        ];

        // Merge revenue data with GeoJSON
        geoJson.features = geoJson.features.map((feature) => {
          const matchingData = revenueData.find(
            (country) => country.name === feature.properties.name
          );
          return {
            ...feature,
            properties: {
              ...feature.properties,
              revenue: matchingData ? matchingData.revenue : 0, // Add revenue property
            },
          };
        });

        setGeoData(geoJson);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchAndConvertData();
  }, []);

  if (!geoData) {
    return <div>Loading map...</div>;
  }

  // Dynamic color scale based on revenue
  const colorScale = scaleLinear()
    .domain([0, 60000]) // Min and max revenue
    .range(["#d4e4ff", "#004080"]); // Light to dark blue

  return (
    <div className="relative flex justify-center items-center w-full h-[500px] overflow-auto border border-gray-200 rounded-lg">
      <ComposableMap projection="geoEqualEarth" width={1200} height={800}>
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const revenue = geo.properties.revenue;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(revenue)} // Dynamic color based on revenue
                  stroke="#000"
                  onMouseEnter={() => {
                    setTooltipContent(
                      `${geo.properties.name}: $${revenue.toLocaleString()}`
                    );
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#f0f8ff", outline: "none" },
                    pressed: { fill: "#E42", outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div className="absolute top-2 left-2 bg-white shadow-md p-2 rounded border border-gray-300 text-sm">
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default GeographicRevenueChart;
