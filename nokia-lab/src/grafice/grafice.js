import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart } from '@mui/x-charts/PieChart';
//import { ModalGrafice } from "./modal_grafice";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';





const Grafice = () => {
  const [loading, setLoading] = useState(true);
  const [slaData, setSlaData] = useState([]);
  const [openData, setOpen] = useState({open: false, tableData: []});

  const handleOpen = (tableContent) => setOpen({open:true, tableData: tableContent});
  const handleClose = () => setOpen({open:false, tableData: []});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/api/index.php");
        const jsonData = await response.json();
        
        setSlaData([
          { label: 'In SLA', 
            value: jsonData.ticketsInSLA.length,
            content: jsonData.ticketsInSLA, 
            columns: jsonData.headers.map(header => {
              return {
                id: header.toLowerCase(), 
                label: header,             
                minWidth: 100              
              };
            })
          },
          { label: 'Out of SLA', 
            value: jsonData.ticketsOutSLA.length, 
            content: jsonData.ticketsOutSLA, 
            columns: jsonData.headers.map(header => {
              return {
                id: header.toLowerCase(), 
                label: header,              
                minWidth: 100               
              };
            })
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
      fetchData();
  }, []);

  const [valueBegin, setValueBegin] = React.useState(dayjs('2022-04-17T15:30'));
  const [valueEnd, setValueEnd] = React.useState(dayjs('2022-04-17T15:30'));



  const timeSpanFilter = [
    { label: 'All' },
    { label: 'Daily' },
    { label: 'Weekly' },
    { label: 'Monthly' },
  ]

  const priorityFilter = [
    { label: 'All', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3},
  ]

  const serviceFilter = [
    { label: '' },
    { label: '' },
    { label: '' }
  ]

  const projectsFilter = [
    { label: '' },
    { label: '' },
    { label: '' }
  ]

  const assignerFilter = [
    { label: '' },
    { label: '' },
    { label: '' }
  ]
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

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
        <>
          <div class="d-flex flex-row justify-content-around align-content-center m-5">
            
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  label="Begin date"
                  value={valueBegin}
                  onChange={(newValue) => setValueBegin(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>      

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  label="End date"
                  value={valueEnd}
                  onChange={(newValue) => setValueEnd(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>   

            <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={timeSpanFilter}
            sx={{ width: 150 }}
            renderInput={(params) => <TextField {...params} label="Time Span" />}
            />    
            <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={priorityFilter}
            sx={{ width: 150 }}
            renderInput={(params) => <TextField {...params} label="Priority" />}
            />    
            <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={serviceFilter}
            sx={{ width: 150 }}
            renderInput={(params) => <TextField {...params} label="Service" />}
            />    
            <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={projectsFilter}
            sx={{ width: 150 }}
            renderInput={(params) => <TextField {...params} label="Projects" />}
            />    
            <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={assignerFilter}
            sx={{ width: 150 }}
            renderInput={(params) => <TextField {...params} label="Assigner" />}
            />    
          </div>   


          <PieChart
            series={[
              {
                data: slaData,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              }
            ]}
    
            onItemClick={(event, d) => { handleOpen(slaData[d.dataIndex])}}

            width={400}
            height={200}
          />


          <Modal
            open={openData.open}
            onClose={handleClose}
          >
            <Box sx={style}>
              <Typography  variant="h6" component="h2">
                {openData.tableData.label}
              </Typography>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {openData.tableData.columns && openData.tableData.columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align='right'
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {openData.tableData.content && openData.tableData.content
                          .map((row) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row.INCIDENT_NUMBER}>
                                {openData.tableData.columns && openData.tableData.columns.map((column) => {
                                  const value = row[column.label];

                                  return (
                                    <TableCell key={column.label} align='right'>
                                      { value }
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};

export default Grafice;
