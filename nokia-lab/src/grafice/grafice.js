import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart } from '@mui/x-charts/PieChart';

const Grafice = () => {
  const [loading, setLoading] = useState(true);
  const [ticketsInSLA, setTicketsInSLA] = useState([]);
  const [ticketsOutSLA, setTicketsOutSLA] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/api/index.php");
        const jsonData = await response.json();

        setTicketsInSLA(jsonData.ticketsInSLA);
        setTicketsOutSLA(jsonData.ticketsOutSLA);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("loading:", loading);
  console.log("ticketsInSLA:", ticketsInSLA);
  console.log("ticketsOutSLA:", ticketsOutSLA);

  return (
    <>
      <h2>Grafice</h2>
      <nav>
        <ul>
          <li>
            <Link to="/">Log-in</Link>
          </li>
          <li>
            <Link to="/homepage">Homepage</Link>
          </li>
        </ul>
      </nav>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <PieChart
          series={[
            {
              data: [
                { label: 'In SLA', value: ticketsInSLA.length },
                { label: 'Out of SLA', value: ticketsOutSLA.length }
              ],
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            }
          ]}
          width={400}
          height={200}
        />
      )}
    </>
  );
};

export default Grafice;
