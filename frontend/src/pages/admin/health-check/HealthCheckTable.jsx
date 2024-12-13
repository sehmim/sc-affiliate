import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useLatestEntry } from "../../../hooks/useLatestEntry";

// Helper function to format the Firestore date
const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown Date";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  });
};

const HealthCheckTable = () => {
  const { loading, error, latestEntry } = useLatestEntry("healthCheckLogin");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log(latestEntry);
  

  if (!latestEntry || !latestEntry.results) return <p>No data available.</p>;

  return (
    <div>
            <h2>Latest Health Check</h2>
      <p>Ran on: {formatDate(latestEntry.date)}</p>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Website</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {latestEntry.results.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.website}</TableCell>
              <TableCell
                style={{
                  color: row.status === "Found" ? "green" : "red",
                }}
              >
                {row.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>

  );
};

export default HealthCheckTable;
