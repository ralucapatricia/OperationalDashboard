import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import './OperationalDashboard.css';


const columns = [
  { id: "INCIDENT_NUMBER", label: "Incident number", minWidth: 170 },
  { id: "SERVICE", label: "Service", minWidth: 100 },
  {
    id: "PRIORITY",label: "Priority",minWidth: 170,align: "right",format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "SUBMIT_DATE",label: "Submit date",minWidth: 170,align: "right",format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "RESOLVED_DATE",
    label: "Resolved Date",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "REQUIRED_RESOLUTION_DATETIME",
    label: "Required Resolution Datatime",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "END_OF_IMPACT",
    label: "End of Impact",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "PANDING_DURATION",
    label: "Panding duration",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "RESOLUTION_CATEGORY",
    label: "Resolution category",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "STATUS",
    label: "Status",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "SUBMITTER",
    label: "Submitter",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "ASSIGNED_GROUP",
    label: "Assigned Group",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "ASSIGNEE",
    label: "Assignee",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "DESCRIPTION",
    label: "Description",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "NOTES",
    label: "Notes",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "RESOLUTION",
    label: "Resolution",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "PROJECT",
    label: "Project",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "RESOLVE_TIME",
    label: "Resolve Time",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "PANDING_MINUTES",
    label: "Panding Minutes",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "CLOSE_DATE",
    label: "Close Date",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "RESOLVE_SLA",
    label: "Resolve SLA ",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "RESPOND_SLA",
    label: "Respond SLA",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "SLA_STATUS",
    label: "SLA status",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];
  


export default function TableMainPage() {
    /*const [rows, setRows] = useState([]);*/
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
    };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
/* useEffect(() => {
      getTickets();
    }, []);

    function getTickets() {
        Axios.get("http://localhost:80/api/tickets/").then(function(response){
        console.log(response.data);
        setRows(response.data);   
        }).catch(error => {
          console.error('Error fetching tickets:', error);
        });
    }
   */
    function createData(INCIDENT_NUMBER,SERVICE,PRIORITY, SUBMIT_DATE, RESOLVED_DATE, REQUIRED_RESOLUTION_DATETIME, END_OF_IMPACT, PANDING_DURATION, RESOLUTION_CATEGORY, STATUS, SUBMITTER, ASSIGNED_GROUP, ASSIGNEE, DESCRIPTION, NOTES, RESOLUTION, PROJECT, RESOLVE_TIME, PANDING_MINUTES, CLOSE_DATE, RESOLVE_SLA, RESPOND_SLA, SLA_STATUS) {
     
      return { INCIDENT_NUMBER,SERVICE,PRIORITY, SUBMIT_DATE, RESOLVED_DATE, REQUIRED_RESOLUTION_DATETIME, END_OF_IMPACT, PANDING_DURATION, RESOLUTION_CATEGORY, STATUS, SUBMITTER, ASSIGNED_GROUP, ASSIGNEE, DESCRIPTION, NOTES, RESOLUTION, PROJECT, RESOLVE_TIME, PANDING_MINUTES, CLOSE_DATE, RESOLVE_SLA, RESPOND_SLA, SLA_STATUS};
    }
    const rows = [
      createData('India', 'IN', 1324171354, 3287263),
      createData('China', 'CN', 1403500365, 9596961),
      createData('Italy', 'IT', 60483973, 301340),
      createData('United States', 'US', 327167434, 9833520),
      createData('Canada', 'CA', 37602103, 9984670),
      createData('Australia', 'AU', 25475400, 7692024),
      createData('Germany', 'DE', 83019200, 357578),
      createData('Ireland', 'IE', 4857000, 70273),
      createData('Mexico', 'MX', 126577691, 1972550),
      createData('Japan', 'JP', 126317000, 377973),
      createData('France', 'FR', 67022000, 640679),
      createData('United Kingdom', 'GB', 67545757, 242495),
      createData('Russia', 'RU', 146793744, 17098246),
      createData('Nigeria', 'NG', 200962417, 923768),
      createData('Brazil', 'BR', 210147125, 8515767),
    ];
  return (
    <>
     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
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
  </>
  );
}
