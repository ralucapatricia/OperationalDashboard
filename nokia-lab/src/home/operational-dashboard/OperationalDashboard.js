import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

import "./OperationalDashboard.css";
import LoadingSpinner from "../../util/LoadingSpinner";
import TicketCount from "./TicketCount";
import FilterOptions from "./FilterOptions";
import { useDownloadExcel } from "react-export-table-to-excel";
import {
  getTickets,
  updateTicket,
} from "./service/OperationalDashboardService";
import { columns } from "./ui-util/TableUtils";
import TabsBar from "./TabsBar";
import ToolBar from "./ToolBar";
import NoResultsPopup from "./NoResultsPopup";

const databaseErrorMessage =
  "The database is currently unavailable 😞 Please try again later.";

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
  const [error, setError] = useState(null);
  const [removeOptions, setRemoveOptions] = useState(false);
  const tableRef = useRef(null);
  const [filterType, setFilterType] = useState("all");
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "tickets",
  });

  const [editedRows, setEditedRows] = useState({});
  const [editedDescriptions, setEditedDescriptions] = useState({});
  const [editedNotes, setEditedNotes] = useState({});
  const [editingColumn, setEditingColumn] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (row, column) => {
    setEditingColumn(column);
    setEditingRow(row);
    setEditedRows({
      ...editedRows,
      [row.INCIDENT_NUMBER]: true,
    });
  };

  const handleSaveClick = async (row) => {
    const updatedRow = {
      ...row,
      DESCRIPTION: editedDescriptions[row.INCIDENT_NUMBER] || row.DESCRIPTION,
      NOTES: editedNotes[row.INCIDENT_NUMBER] || row.NOTES,
    };

    try {
      const response = await updateTicket(updatedRow);
      if (response.status === 1) {
        setRows((prevRows) =>
          prevRows.map((r) =>
            r.INCIDENT_NUMBER === row.INCIDENT_NUMBER ? updatedRow : r
          )
        );
        setEditedDescriptions((prev) => {
          const newState = { ...prev };
          delete newState[row.INCIDENT_NUMBER];
          return newState;
        });
        setEditedNotes((prev) => {
          const newState = { ...prev };
          delete newState[row.INCIDENT_NUMBER];
          return newState;
        });
        setEditedRows((prev) => {
          const newState = { ...prev };
          delete newState[row.INCIDENT_NUMBER];
          return newState;
        });
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  };

  const handleDescriptionChange = (event, code) => {
    const { value } = event.target;
    setEditedDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [code]: value,
    }));
  };

  const handleNoteChange = (event, code) => {
    const { value } = event.target;
    setEditedNotes((prevNotes) => ({
      ...prevNotes,
      [code]: value,
    }));
  };

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
    setTotalTickets(filteredData.length);
  }, [filteredData, rows]);

  async function fetchTicketsAndSetRows() {
    setLoading(true);
    try {
      const tickets = await getTickets();
      setRows(tickets);
      setTotalTickets(tickets.length);
      setError(null);
    } catch (error) {
      setError(databaseErrorMessage);
      setRemoveOptions(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let filteredTickets = [];

    if (all) {
      filteredTickets = rows;
    } else if (open) {
      filteredTickets = rows.filter(
        (ticket) => ticket.is_pending === true && ticket.days > 0
      );
    } else if (closed) {
      filteredTickets = rows.filter((ticket) => ticket.days < 0);
    }
    setFilteredData(filteredTickets);
  }, [all, open, closed, rows]);

  if (error && !loading) {
    return (
      <>
        <ToolBar removeOptions={removeOptions} />
        <NoResultsPopup message={error}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              style={{
                textDecoration: "none",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#001f67",
                fontSize: "20px",
                transitionDuration: "0.4s",
                textAlign: "center",
                color: "white",
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
              onClick={fetchTicketsAndSetRows}
            >
              Retry
            </button>
          </div>
        </NoResultsPopup>
      </>
    );
  }

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ToolBar onExportClick={onDownload} />
          <TabsBar
            currentTab={all ? 1 : open ? 2 : closed ? 3 : 1}
            handleChangeTab={(event, newValue) => {
              if (newValue === 1) {
                setFilterType("all");
                setAll(true);
                setOpen(false);
                setClosed(false);
              } else if (newValue === 2) {
                setFilterType("open");
                setOpen(true);
                setAll(false);
                setClosed(false);
              } else if (newValue === 3) {
                setFilterType("closed");
                setClosed(true);
                setAll(false);
                setOpen(false);
              }
              setPage(0);
            }}
          />
          <div style={{ padding: "20px" }}>
            <FilterOptions
              setFilteredData={setFilteredData}
              filterType={filterType}
            />
          </div>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 540 }}>
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
                          if (column.id === "DESCRIPTION") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {editedRows.hasOwnProperty(
                                  row.INCIDENT_NUMBER
                                ) &&
                                editingRow === row &&
                                editingColumn === column.id ? (
                                  <>
                                    <TextField
                                      value={
                                        editedDescriptions[
                                          row.INCIDENT_NUMBER
                                        ] !== undefined
                                          ? editedDescriptions[
                                              row.INCIDENT_NUMBER
                                            ]
                                          : row.DESCRIPTION
                                      }
                                      onChange={(event) =>
                                        handleDescriptionChange(
                                          event,
                                          row.INCIDENT_NUMBER
                                        )
                                      }
                                      autoFocus
                                    />
                                    <IconButton
                                      onClick={() => handleSaveClick(row)}
                                    >
                                      <CheckIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <>
                                    <div>{row.DESCRIPTION}</div>
                                    <IconButton
                                      onClick={() =>
                                        handleEditClick(row, column.id)
                                      }
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </>
                                )}
                              </TableCell>
                            );
                          } else if (column.id === "NOTES") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {editedRows.hasOwnProperty(
                                  row.INCIDENT_NUMBER
                                ) &&
                                editingRow === row &&
                                editingColumn === column.id ? (
                                  <>
                                    <TextField
                                      value={
                                        editedNotes[row.INCIDENT_NUMBER] !==
                                        undefined
                                          ? editedNotes[row.INCIDENT_NUMBER]
                                          : row.NOTES
                                      }
                                      onChange={(event) =>
                                        handleNoteChange(
                                          event,
                                          row.INCIDENT_NUMBER
                                        )
                                      }
                                      autoFocus
                                    />
                                    <IconButton
                                      onClick={() => handleSaveClick(row)}
                                    >
                                      <CheckIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <>
                                    <div>{row.NOTES}</div>
                                    <IconButton
                                      onClick={() =>
                                        handleEditClick(row, column.id)
                                      }
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </>
                                )}
                              </TableCell>
                            );
                          }
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
