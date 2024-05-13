import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ToolBar from "./ToolBar";
import "./OperationalDashboard.css";
import LoadingSpinner from "../../util/LoadingSpinner";
import TicketCount from "./TicketCount";
import FilterOptions from "./FilterOptions";
import { useDownloadExcel } from "react-export-table-to-excel";
import { getTickets } from "./service/OperationalDashboardService";
import { columns } from "./ui-util/TableUtils";
import TabsBar from "./TabsBar";

// import NoResultsPopup from "./NoResultsPopup";

export default function OperationalDashboard() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [enableFilters, setEnableFilters] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [closed, setClosed] = useState(false);
  const [open, setOpen] = useState(false);
  const [all, setAll] = useState(true);
  // const [error, setError] = useState();
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "tickets",
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    fetchTicketsAndSetRows();
  }, [closed, open]);

  useEffect(() => {
    if (filteredData.length > 0) {
      setEnableFilters(true);
    } else {
      setEnableFilters(false);
    }
  }, [filteredData]);

  async function fetchTicketsAndSetRows() {
    setLoading(true);
    try {
      const tickets = await getTickets();
      let filteredTickets = [];
  
      if (all) {
        filteredTickets = tickets;
      } else if (open) {
        filteredTickets = tickets.filter(ticket => ticket.days > 0);
      } else if (closed) {
        filteredTickets = tickets.filter(ticket => ticket.days < 0);
      }
  
      setRows(filteredTickets);
      setTotalTickets(filteredTickets.length);
    } catch (err) {
      console.error("Error fetching tickets: ", err);
    } finally {
      setLoading(false);
    }
  }
  

  // if (error && !loading) {
  //   console.log("intra");
  //   return <NoResultsPopup message={error} />;
  // }

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ToolBar onExportClick={onDownload} />
          <TabsBar currentTab={all ? 1 : open ? 2 : closed ? 3 : 1} handleChangeTab={(event, newValue) => {
    if (newValue === 1) {
      setAll(true);
      setOpen(false);
      setClosed(false);
    } else if (newValue === 2) {
      setOpen(true);
      setAll(false);
      setClosed(false);
    } else if (newValue === 3) {
      setClosed(true);
      setAll(false);
      setOpen(false);
    }
}} />
          {/* <button
            onClick={() => {
              setAll(true);
              setOpen(false);
              setClosed(false);
            }}
          >
            ALL
          </button>
          <button
            onClick={() => {
              setOpen(true);
              setAll(false);
              setClosed(false);
            }}
          >
            OPEN
          </button>
          <button
            onClick={() => {
              setClosed(true);
              setAll(false);
              setOpen(false);
            }}
          >
            CLOSED
          </button> */}
          <div style={{ padding: "20px" }}>
            <FilterOptions setFilteredData={setFilteredData} />
          </div>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 580 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                id="myTable"
                ref={tableRef}
              >
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(enableFilters ? filteredData : rows)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === "TIME_REMAINING" && row["days"] < 0
                                ? "CLOSED"
                                : column.id === "TIME_REMAINING"
                                ? `${row["days"]} days, ${row["hours"]}:${row["minutes"]}:${row["seconds"]}`
                                : column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <TicketCount value={totalTickets} />
        </>
      )}
    </>
  );
}
