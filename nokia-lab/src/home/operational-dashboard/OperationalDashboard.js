import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useDownloadExcel } from "react-export-table-to-excel";
import "./OperationalDashboard.css";
import LoadingSpinner from "../../util/LoadingSpinner";
import TicketCount from "./TicketCount";
import FilterOptions from "./FilterOptions";
import {
  getTickets,
  updateTicket,
  getUser,
} from "./service/OperationalDashboardService";
import { columns } from "./ui-util/TableUtils";
import TabsBar from "./TabsBar";
import ToolBar from "./ToolBar";
import NoResultsPopup from "./NoResultsPopup";
import EditableCell from "./EditableCell";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";  // Import Tooltip

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

  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);


  const handleEditClick = (row) => {
    if (row.days >= 0) {
      setEditingRow(row);
      setEditedValues(row);
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await updateTicket(editedValues);
      if (response.status === 1) {
        setRows((prevRows) =>
          prevRows.map((r) =>
            r.INCIDENT_NUMBER === editedValues.INCIDENT_NUMBER
              ? editedValues
              : r
          )
        );
        setEditingRow(null);
        setEditedValues({});
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingRow(null);
    setEditedValues({});
  };

  const handleChange = (event, columnId) => {
    const { value } = event.target;
    setEditedValues((prev) => ({
      ...prev,
      [columnId]: value,
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
        (ticket) => ticket.is_pending === true && ticket.days >= 0
      );
    } else if (closed) {
      filteredTickets = rows.filter((ticket) => ticket.days < 0);
    }
    setFilteredData(filteredTickets);
  }, [all, open, closed, rows]);


  //notifications
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
  
    fetchCurrentUser();
  }, []);
  
  useEffect(() => {
    const fetchUserAndSetNotifications = async () => {
      try {
        if (!currentUser) return;
  
        const username = currentUser.USERNAME; 
        const notifications = rows
          .filter(
            (ticket) =>
              ticket.minutes < 60 && ticket.minutes > 0 &&
              ticket.days == 0 &&
              ticket.hours == 0 &&
              ticket.ASSIGNEE == username
          )
          .map(
            (ticket) =>
              `Your ticket ${ticket.INCIDENT_NUMBER} is approaching its SLA deadline. Time remaining: ${ticket.minutes}`
          );
        setNotifications(notifications);
        console.log(notifications);
      } catch (error) {
        console.error("Error fetching user or setting notifications:", error);
      }
    };
  
    fetchUserAndSetNotifications();
  }, [rows, currentUser]);
  
  
  
  
  


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
          <ToolBar
            onExportClick={onDownload}
            removeOptions={removeOptions}
            notifications={notifications}
          />
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
                          const isEditing =
                            editingRow &&
                            editingRow.INCIDENT_NUMBER === row.INCIDENT_NUMBER;
                          const isClosed = row["days"] < 0;

                          if (column.id === "EDIT") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {isEditing ? (
                                  <>
                                    <IconButton
                                      onClick={handleSaveClick}
                                      size="small"
                                      color="primary"
                                    >
                                      <SaveIcon />
                                    </IconButton>
                                    <IconButton
                                      onClick={handleCancelClick}
                                      size="small"
                                      color="secondary"
                                    >
                                      <CancelIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <Tooltip
                                    title={
                                      isClosed
                                        ? "Closed tickets cannot be edited"
                                        : "Edit"
                                    }
                                  >
                                    <span>
                                      <IconButton
                                        onClick={() => handleEditClick(row)}
                                        size="small"
                                        color="primary"
                                        disabled={isClosed}
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                )}
                              </TableCell>
                            );
                          }

                          if (
                            [
                              "DESCRIPTION",
                              "NOTES",
                              "CLOSE_DATE",
                              "RESOLVED_DATE",
                              "END_OF_IMPACT",
                              "RESOLVE_SLA",
                              "RESPOND_SLA",
                              "SLA_STATUS",
                            ].includes(column.id)
                          ) {
                            return (
                              <EditableCell
                                key={column.id}
                                value={
                                  isEditing ? editedValues[column.id] : value
                                }
                                isEditing={isEditing}
                                columnId={column.id}
                                onChange={(event) =>
                                  handleChange(event, column.id)
                                }
                              />
                            );
                          }

                          return (
                            <TableCell key={column.id} align={column.align}>
                            {column.id === "TIME_REMAINING" && isClosed ? (
                              <span style={{ backgroundColor: "gray", color: "white", borderRadius: "4px", padding: "5px" }}>CLOSED</span>
                            ) : (
                              column.id === "TIME_REMAINING" ? (
                                <span style={{ 
                                  backgroundColor: isClosed ? "gray" : "green", 
                                  color: "white", 
                                  borderRadius: "4px", 
                                  padding: "10px", 
                                  display: "inline-block", 
                                  minWidth: "100px", 
                                  textAlign: "center", 
                                }}>
                                  {`${row["days"]} days, ${row["hours"]}:${row["minutes"]}:${row["seconds"]}`}
                                </span>
                              ) : (
                                column.format && typeof value === "number" ? (
                                  column.format(value)
                                ) : (
                                  value
                                )
                              )
                            )}
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
