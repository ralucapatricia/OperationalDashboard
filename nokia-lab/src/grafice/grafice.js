import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
// In Grafice component file
import PopUp from './components/popup.js';
//import { ModalGrafice } from "./modal_grafice";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import debounce from 'lodash/debounce';
import './grafice.css';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';




const BasicMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate(); //hook pt navigare
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        style={{color: "#072636"}}
        onClick={handleClick}
     
      >
        menu
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => { navigate("/homepage"); handleClose(); }}>Dashboard</MenuItem>
        <MenuItem onClick={() => { navigate("/"); handleClose(); }}>Logout</MenuItem>
      </Menu>
    </div>
  );
}



const Grafice = () => {
  const [loading, setLoading] = useState(true);
  const [slaData, setSlaData] = useState([]);
  const [lineChartData, setLineChartData] = useState(null);
  const [openData, setOpen] = useState({ open: false, tableData: [] });
  const [barChartData, setBarChartData] = useState(null);
  const url = 'http://localhost/api/Charts/';


  const handleOpen = (tableContent) => setOpen({ open: true, tableData: tableContent });
  const handleClose = () => setOpen({ open: false, tableData: [] });

  const [filters, setFilters] = useState({
    valueBegin: dayjs().subtract(5, 'year'),  //pune data curenta in casuta
    valueEnd: dayjs().add(5, 'year'),
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

  function organizeDataByDate(detailedData) {
    const dataByDate = {};

    detailedData.forEach(entry => {
      const date = entry.yearMonth;

      if (!dataByDate[date]) {
        dataByDate[date] = [];
      }

      dataByDate[date].push(entry);
    });

    return dataByDate;
  }

  function transformBarData(list) {
    const transformedData = {
      prio1: [],
      prio2: [],
      prio3: []
    };

    list.forEach(entry => {
      if (entry.PRIORITY === 1) {
        transformedData.prio1.push(entry);
      } else if (entry.PRIORITY === 2) {
        transformedData.prio2.push(entry);
      } else if (entry.PRIORITY === 3) {
        transformedData.prio3.push(entry);
      }
    });

    return transformedData;
  }

  function convertToListOfLists(dataByDate) {
    const listOfLists = Object.keys(dataByDate).sort().map(date => ({
      date: date,
      list: dataByDate[date]
    }));

    return listOfLists;
  }

  const populateData = (jsonData) => {

    const processedColumns = jsonData.graphics.sla.headers.map(header => {
      return {
        id: header.toLowerCase(),
        label: header,
        minWidth: 100
      };
    });

    setSlaData([
      {
        label: 'In SLA',
        value: jsonData.graphics.sla.ticketsInSLA.length,
        content: jsonData.graphics.sla.ticketsInSLA,
        columns: processedColumns
      },
      {
        label: 'Out of SLA',
        value: jsonData.graphics.sla.ticketsOutSLA.length,
        content: jsonData.graphics.sla.ticketsOutSLA,
        columns: processedColumns
      }
    ]);

    const processedLineChartData = convertToListOfLists(organizeDataByDate(jsonData.graphics.line.detailed))

    setLineChartData({
      label: 'Tickets',
      detailed: processedLineChartData,
      columns: processedColumns
    }
    );

    const processedBarChartData = processedLineChartData.map(entry => ({
      date: entry.date,
      ...transformBarData(entry.list)
    }));

    setBarChartData({
      label: 'Tickets by stacked priority',
      detailed: processedBarChartData,
      list: processedLineChartData,
      columns: processedColumns
    });
  }



  const updateBackend = useCallback(
    debounce(async (newFilters) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFilters),
        });

        const jsonData = await response.json();
        populateData(jsonData);

      } catch (error) {
        console.error('Error:', error);
      }
    }, 300), // Adjust debounce delay as needed
    []
  );

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: dayjs.isDayjs(value) ? dayjs(value) : value };
    setFilters(newFilters);

    updateBackend(newFilters);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {

          }
        });
        const jsonData = await response.json();

        setOptions({
          timeSpanFilter: jsonData.filters.timeSpanFilter,
          priorityFilter: jsonData.filters.priorityFilter,
          serviceFilter: jsonData.filters.serviceFilter,
          projectsFilter: jsonData.filters.projectsFilter,
          assigneeFilter: jsonData.filters.assigneeFilter
        })

        populateData(jsonData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  return (
    <>
    <div className = "bg2">
    <div className = "header-container">  
      <h2 className="title" >Grafice</h2>
      <BasicMenu />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div class="d-flex flex-row justify-content-around align-content-center mx-5 mb-5"> {/*bootstrap CSS library*/}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  label="Begin date"
                  value={filters.valueBegin}
                  onChange={(newValue) => handleFilterChange('valueBegin', newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  label="End date"
                  value={filters.valueEnd}
                  onChange={(newValue) => handleFilterChange('valueEnd', newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>

            <Autocomplete
              disablePortal
              id="priority"
              options={options.priorityFilter}
              sx={{ width: 150 , marginTop:1 }}
              renderInput={(params) => <TextField {...params} label="Priority" />}
              onChange={(event, newValue) => handleFilterChange('priority', newValue)}
            />
            <Autocomplete
              disablePortal
              id="service"
              options={options.serviceFilter}
              sx={{ width: 150 , marginTop:1 }}
              renderInput={(params) => <TextField {...params} label="Service" />}
              onChange={(event, newValue) => handleFilterChange('service', newValue)}
            />
            <Autocomplete
              disablePortal
              id="project"
              options={options.projectsFilter}
              sx={{ width: 150 , marginTop:1 }}
              renderInput={(params) => <TextField {...params} label="Projects" />}
              onChange={(event, newValue) => handleFilterChange('project', newValue)}
            />
            <Autocomplete
              disablePortal
              id="assignee"
              options={options.assigneeFilter}
              sx={{ width: 150 , marginTop:1 }}
              renderInput={(params) => <TextField {...params} label="Assignee" />}
              onChange={(event, newValue) => handleFilterChange('assignee', newValue)}
            />
          </div>

          <div className="container">
            <PieChart
              series={[
                {
                  data: slaData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  arcLabel: (item) => `${item.label} (${item.value})`,
                  arcLabelMinAngle: 45,
                }
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: 'white',
                  fontWeight: 'light',
                  fontSize: 10
                },
              }}
              onItemClick={(event, d) => { handleOpen(slaData[d.dataIndex]) }}
              height={200}
              width={444}
            />

            <LineChart
              series={[
                {
                  data: lineChartData.detailed.map(entry => entry.list.length),
                  label: 'Tickets',
                  color: '#072636',
                },
              ]}
              xAxis={[{ scaleType: 'point', data: lineChartData.detailed.map(entry => entry.date.toString()) }]}
              height={300}
              width={444}
              margin={{ left: 60, right: 60, top: 60, bottom: 60 }}
              grid={{ vertical: true, horizontal: true }}
              onMarkClick={(event, d) => {
                handleOpen({
                  label: lineChartData.label,
                  columns: lineChartData.columns,
                  content: lineChartData.detailed[d.dataIndex].list,
                })
              }}
            />

            <BarChart
              series={[
                { id: 'prio1', data: barChartData?.detailed?.map(entry => entry.prio1.length) || [], stack: 'Priority', label: 'One', color: '#072636' },
                { id: 'prio2', data: barChartData?.detailed?.map(entry => entry.prio2.length) || [], stack: 'Priority', label: 'Two', color: '#2E96FF' },
                { id: 'prio3', data: barChartData?.detailed?.map(entry => entry.prio3.length) || [], stack: 'Priority', label: 'Three', color: '#02B2AF' },
              ]}
              xAxis={[{ scaleType: 'band', data: barChartData.detailed.map(entry => entry.date.toString()) }]}
              margin={{ left: 60, right: 60, top: 60, bottom: 60 }}
              height={350}
              width={444}
              onItemClick={(event, d) => {
                handleOpen({
                  label: barChartData.label,
                  columns: barChartData.columns,
                  content: barChartData.detailed[d.dataIndex][d.seriesId],
                })
              }}
              onAxisClick={(event, d) => {
                handleOpen({
                  label: barChartData.label,
                  columns: barChartData.columns,
                  content: barChartData.list[d.dataIndex].list,
                })
              }}
            />

            <LineChart
              series={[
                {
                  id: 'prio1', data: barChartData?.detailed?.map(entry => entry.prio1.length) || [], stack: 'Priority', label: 'One', color: '#072636', area: true,
                  highlightScope: {
                    highlighted: 'item',
                  },
                },
                {
                  id: 'prio2', data: barChartData?.detailed?.map(entry => entry.prio2.length) || [], stack: 'Priority', label: 'Two', color: '#2E96FF', area: true,
                  highlightScope: {
                    highlighted: 'item',
                  },
                },
                {
                  id: 'prio3', data: barChartData?.detailed?.map(entry => entry.prio3.length) || [], stack: 'Priority', label: 'Three', color: '#02B2AF', area: true,
                  highlightScope: {
                    highlighted: 'item',
                  },
                },
              ]}
              xAxis={[{ scaleType: 'point', data: barChartData.detailed.map(entry => entry.date.toString()) }]}
              margin={{ left: 60, right: 60, top: 60, bottom: 60 }}
              height={350}
              width={444}
              onMarkClick={(event, d) => {
                handleOpen({
                  label: barChartData.label,
                  columns: barChartData.columns,
                  content: barChartData.detailed[d.dataIndex][d.seriesId],
                })
              }}
              onAxisClick={(event, d) => {
                handleOpen({
                  label: barChartData.label,
                  columns: barChartData.columns,
                  content: barChartData.list[d.dataIndex].list,
                })
              }}
            />

          </div>

          <PopUp openData={openData} handleClose={handleClose} />
        </>
      )}
      </div>
    </>
  );
};

export default Grafice;
