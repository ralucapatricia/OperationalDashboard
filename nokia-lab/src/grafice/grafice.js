import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { LineChart } from '@mui/x-charts/LineChart';
import debounce from 'lodash/debounce';
import './grafice.css';  


const Grafice = () => {
  const [loading, setLoading] = useState(true);
  const [slaData, setSlaData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [openData, setOpen] = useState({open: false, tableData: []});

  const navigate = useNavigate(); //hook pt navigare

  const handleOpen = (tableContent) => setOpen({open:true, tableData: tableContent});
  const handleClose = () => setOpen({open:false, tableData: []});

  const [filters, setFilters] = useState({
    valueBegin: dayjs(),
    valueEnd: dayjs(),
    timeSpan: null,
    priority: null,
    service: null,
    project: null,
    assignee: null,
  });

  const [options, setOptions] = useState({
    timeSpanFilter: null,
    priorityFilter: null,
    serviceFilter: null,
    projectsFilter: null,
    assigneeFilter: null,
  });


  const updateBackend = useCallback(
    debounce(async (newFilters) => {
      try {
        const response = await fetch('http://localhost/api/Charts/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFilters),
        });

        const jsonData = await response.json();

        setSlaData([
          { label: 'In SLA', 
            value: jsonData.graphics.sla.ticketsInSLA.length,
            content: jsonData.graphics.sla.ticketsInSLA, 
            columns: jsonData.graphics.sla.headers.map(header => {
              return {
                id: header.toLowerCase(), 
                label: header,             
                minWidth: 100              
              };
            })
          },
          { label: 'Out of SLA', 
            value: jsonData.graphics.sla.ticketsOutSLA.length, 
            content: jsonData.graphics.sla.ticketsOutSLA, 
            columns: jsonData.graphics.sla.headers.map(header => {
              return {
                id: header.toLowerCase(), 
                label: header,              
                minWidth: 100               
              };
            })
          }
        ]);

        setLineChartData(jsonData.graphics.line);
      } catch (error) {
        console.error('Error:', error);
      }
    }, 300), // Adjust debounce delay as needed
    []
  );

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: dayjs.isDayjs(value) ? dayjs(value) : value};
    setFilters(newFilters); 
    console.log(newFilters);
    
    updateBackend(newFilters);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/api/Charts/", {
          method: 'GET',
          headers: {
            
          }});
        const jsonData = await response.json();
        
        setOptions({
          timeSpanFilter: jsonData.filters.timeSpanFilter,
          priorityFilter: jsonData.filters.priorityFilter,
          serviceFilter: jsonData.filters.serviceFilter,
          projectsFilter: jsonData.filters.projectsFilter,
          assigneeFilter: jsonData.filters.assigneeFilter
        })

        setSlaData([
          { label: 'In SLA', 
            value: jsonData.graphics.sla.ticketsInSLA.length,
            content: jsonData.graphics.sla.ticketsInSLA, 
            columns: jsonData.graphics.sla.headers.map(header => {
              return {
                id: header.toLowerCase(), 
                label: header,             
                minWidth: 100              
              };
            })
          },
          { label: 'Out of SLA', 
            value: jsonData.graphics.sla.ticketsOutSLA.length, 
            content: jsonData.graphics.sla.ticketsOutSLA, 
            columns: jsonData.graphics.sla.headers.map(header => {
              return {
                id: header.toLowerCase(), 
                label: header,              
                minWidth: 100               
              };
            })
          }
        ]);
        
        setLineChartData(jsonData.graphics.line);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
      fetchData();
  }, []);


  
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
      <h2 align="center" >Grafice</h2>  {/*alinierea de aici nu face nimic*/}
      <nav>
        <ul>
          <div className="buttons-container">
            <button  className="nav-button" onClick={() => navigate("/")}>Log-in</button>
            <button className="nav-button" onClick={() => navigate("/homepage")}>Homepage</button>
          </div>
        </ul>
      </nav>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div class="d-flex flex-row justify-content-around align-content-center m-5"> {/*bootstrap CSS library*/}
            
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  label="Begin date"
                  value={filters.valueBegin}
                  onChange={(newValue) => handleFilterChange('valueBegin',  newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>      

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  label="End date"
                  value={filters.valueEnd}
                  onChange={(newValue) => handleFilterChange('valueEnd', newValue )}
                />
              </DemoContainer>
            </LocalizationProvider>   

            <Autocomplete
        disablePortal
        id="time-span"
        options={options.timeSpanFilter}
        sx={{ width: 150 }}
        renderInput={(params) => <TextField {...params} label="Time Span" />}
        onChange={(event, newValue) => handleFilterChange('timeSpan', newValue)}
      />    

            <Autocomplete
        disablePortal
        id="priority"
        options={options.priorityFilter}
        sx={{ width: 150 }}
        renderInput={(params) => <TextField {...params} label="Priority" />}
        onChange={(event, newValue) => handleFilterChange('priority', newValue)}
      />    
            <Autocomplete
        disablePortal
        id="service"
        options={options.serviceFilter}
        sx={{ width: 150 }}
        renderInput={(params) => <TextField {...params} label="Service" />}
        onChange={(event, newValue) => handleFilterChange('service', newValue)}
      />     
             <Autocomplete
        disablePortal
        id="project"
        options={options.projectsFilter}
        sx={{ width: 150 }}
        renderInput={(params) => <TextField {...params} label="Projects" />}
        onChange={(event, newValue) => handleFilterChange('project', newValue)}
      />   
            <Autocomplete
        disablePortal
        id="assigner"
        options={options.assigneeFilter}
        sx={{ width: 150 }}
        renderInput={(params) => <TextField {...params} label="Assigner" />}
        onChange={(event, newValue) => handleFilterChange('assigner', newValue)}
      />
          </div>   

          <div className="container">
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
          <LineChart
            series={[
              {
                data: lineChartData.map(entry => entry.count),
              },
            ]}
            xAxis={[{ scaleType: 'point', data: lineChartData.map(entry => entry.yearMonth.toString()) }]}
            height={300}
            margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
            grid={{ vertical: true, horizontal: true }}
          />

          </div>

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
