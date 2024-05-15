import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Axios from "axios";
import ClearableProp from "./ClearableProp";
import Box from '@mui/material/Box';
import NoResultsPopup from "./NoResultsPopup";

import "./NoResultsPopup.css";
import {
  incidentNumberOptions,
  serviceOptions,
  priorityOptions,
  pendingDurationOptions,
  resolutionCategoryOptions,
  statusOptions,
  submitterOptions,
  assignedGroupOptions,
  AssigneeOptions,
  projectOptions,
  resolveTimeOptions,
  pendingMinutesOptions,
  resolveSLAOptions,
  respondSLAOptions,
  SLAstatusOptions,
} from "./ui-util/TableUtils";
import { getBackendUrl } from "./service/OperationalDashboardService";

const filterOptions = createFilterOptions({
  matchFrom: "start",
  stringify: (option) => option.title,
});

export default function FilterOptions({ setFilteredData }) {
  const [filters, setFilters] = useState({
    incidentNumber:null,
    service:null,
    priority:null,
    pendingDuration:null,
    resolutionCategory:null,
    statusOptions:null,
    submitter: null,
    assignedGroup: null,
    assignee: null,
    project: null,
    resolveTime: null,
    pendingMinutes: null,
    resolveSLA: null,
    respondSLA: null,
    SLAstatus: null,
  });
  const [closeDate, setCloseDate] = useState(null);
  const [submitDate, setSubmitDate] = useState(null);
  const [resolvedDate, setResolvedDate] = useState(null);
  const [requiredResolutionDataTime, setRequiredResolutionDataTime] = useState(null);
  const [endOfImpact, setEndOfImpact] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (field, newValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: newValue,
      closeDate: closeDate,
      submitDate: submitDate,
      resolvedDate: resolvedDate,
      requiredResolutionDataTime: requiredResolutionDataTime,
      endOfImpact: endOfImpact,
    }));
    fetchFilteredData({ ...filters, [field]: newValue, closeDate: closeDate, 
      submitDate: submitDate,
      resolvedDate: resolvedDate,
      requiredResolutionDataTime: requiredResolutionDataTime,
      endOfImpact: endOfImpact,
     });
  };

  const handleDateChange = (newValue) => {
    setCloseDate(newValue);
    fetchFilteredData({ ...filters, closeDate: newValue ,
      /*submitDate: submitDate,
      resolvedDate: resolvedDate,
      requiredResolutionDataTime: requiredResolutionDataTime,
      endOfImpact: endOfImpact,*/
    });
  };

  const handleSubmitDateChange = (newValue) => {
    setSubmitDate(newValue);
    fetchFilteredData({ ...filters, //closeDate: closeDate ,
      submitDate: newValue,
      /*resolvedDate: resolvedDate,
      requiredResolutionDataTime: requiredResolutionDataTime,
      endOfImpact: endOfImpact,*/
    });
  };

  const handleResolvedDateChange = (newValue) => {
    setResolvedDate(newValue);
    fetchFilteredData({ ...filters, //closeDate: closeDate ,
      //submitDate: submitDate,
      resolvedDate: newValue,
      /*requiredResolutionDataTime: requiredResolutionDataTime,
      endOfImpact: endOfImpact,*/
    });
  };

  const handleRequiredDateChange = (newValue) => {
    setRequiredResolutionDataTime(newValue);
    fetchFilteredData({ ...filters, //closeDate: closeDate ,
      //submitDate: submitDate,
      //resolvedDate: resolvedDate,
      requiredResolutionDataTime: newValue,
      //endOfImpact: endOfImpact,
    });
  };

  const handleEndOfImpactDateChange = (newValue) => {
    setEndOfImpact(newValue);
    fetchFilteredData({ ...filters, //closeDate: closeDate ,
      //submitDate: submitDate,
      /*resolvedDate: resolvedDate,
      requiredResolutionDataTime: requiredResolutionDataTime,*/
      endOfImpact: newValue,
    });
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      incidentNumber: newValue
    }));
    fetchFilteredData({ ...filters, incidentNumber: newValue });
  };

  function CloseButtonHandler() {
    setShowPopup(false);
    setFilters({
      incidentNumber: null,
      service: null,
      priority: null,
      pendingDuration: null,
      resolutionCategory: null,
      statusOptions: null,
      submitter: null,
      assignedGroup: null,
      assignee: null,
      project: null,
      resolveTime: null,
      pendingMinutes: null,
      resolveSLA: null,
      respondSLA: null,
      SLAstatus: null,
  });
    
    setCloseDate(null);
    setEndOfImpact(null);
    setRequiredResolutionDataTime(null);
    setResolvedDate(null);
    setSubmitDate(null);
  }

  const fetchFilteredData = async ({
    incidentNumber,
    service,
    priority,
    pendingDuration,
    resolutionCategory,
    statusOptions,
    submitter,
    assignedGroup,
    assignee,
    project,
    resolveTime,
    pendingMinutes,
    closeDate,
    submitDate,
    resolvedDate,
    endOfImpact,
    requiredResolutionDataTime,
    resolveSLA,
    respondSLA,
    SLAstatus,
  }) => {
    try {
      let queryParams = {};
      if(incidentNumber){
        queryParams["incidentNumber"] = incidentNumber;
      }
      if(service){
        queryParams["service"] = service.title;
      }
      if(priority){
        queryParams["priority"] = priority.title;
      }
      if(pendingDuration){
        queryParams["pendingDuration"] = pendingDuration.title;
      }
      if(resolutionCategory){
        queryParams["resolutionCategory"] = resolutionCategory.title;
      }
      if(statusOptions){
        queryParams["statusOptions"] = statusOptions.title;
      }
      if (submitter) {
        queryParams["submitter"] = submitter.title;
      }
      if (assignedGroup) {
        queryParams["assignedGroup"] = assignedGroup.title;
      }
      if (assignee) {
        queryParams["assignee"] = assignee.title;
      }
      if (project) {
        queryParams["project"] = project.title;
      }
      if (resolveTime) {
        queryParams["resolveTime"] = resolveTime.title;
      }
      if (pendingMinutes) {
        queryParams["pendingMinutes"] = pendingMinutes.title;
      }
      if (closeDate) {
        const dateObject = new Date(closeDate);
        if (!isNaN(dateObject.getTime())) {
          const year = dateObject.getFullYear();
          const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
          const day = ("0" + dateObject.getDate()).slice(-2);
          const hours = ("0" + dateObject.getHours()).slice(-2);
          const minutes = ("0" + dateObject.getMinutes()).slice(-2);
          const seconds = ("0" + dateObject.getSeconds()).slice(-2);
          const formattedCloseDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          queryParams["closeDate"] = formattedCloseDate;
        } else {
          console.error("closeDate not valid!");
        }
      }

      if (submitDate) {
        const dateObject = new Date(submitDate);
        if (!isNaN(dateObject.getTime())) {
          const year = dateObject.getFullYear();
          const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
          const day = ("0" + dateObject.getDate()).slice(-2);
          const hours = ("0" + dateObject.getHours()).slice(-2);
          const minutes = ("0" + dateObject.getMinutes()).slice(-2);
          const seconds = ("0" + dateObject.getSeconds()).slice(-2);
          const formattedSubmitDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          queryParams["submitDate"] = formattedSubmitDate;
        } else {
          console.error("submitDate not valid!");
        }
      }

      if (requiredResolutionDataTime) {
        const dateObject = new Date(requiredResolutionDataTime);
        if (!isNaN(dateObject.getTime())) {
          const year = dateObject.getFullYear();
          const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
          const day = ("0" + dateObject.getDate()).slice(-2);
          const hours = ("0" + dateObject.getHours()).slice(-2);
          const minutes = ("0" + dateObject.getMinutes()).slice(-2);
          const seconds = ("0" + dateObject.getSeconds()).slice(-2);
          const formattedCloseDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          queryParams["requiredResolutionDataTime"] = formattedCloseDate;
        } else {
          console.error("requiredResolutionDataTime not valid!");
        }
      }
      
      if (resolvedDate) {
        const dateObject = new Date(resolvedDate);
        if (!isNaN(dateObject.getTime())) {
          const year = dateObject.getFullYear();
          const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
          const day = ("0" + dateObject.getDate()).slice(-2);
          const hours = ("0" + dateObject.getHours()).slice(-2);
          const minutes = ("0" + dateObject.getMinutes()).slice(-2);
          const seconds = ("0" + dateObject.getSeconds()).slice(-2);
          const formattedResolvedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          queryParams["resolvedDate"] = formattedResolvedDate;
        } else {
          console.error("resolvedDate not valid!");
        }
      }

      if (endOfImpact) {
        const dateObject = new Date(endOfImpact);
        if (!isNaN(dateObject.getTime())) {
          const year = dateObject.getFullYear();
          const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
          const day = ("0" + dateObject.getDate()).slice(-2);
          const hours = ("0" + dateObject.getHours()).slice(-2);
          const minutes = ("0" + dateObject.getMinutes()).slice(-2);
          const seconds = ("0" + dateObject.getSeconds()).slice(-2);
          const formattedEndOfImpactDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          queryParams["endOfImpact"] = formattedEndOfImpactDate;
        } else {
          console.error("endOfImpact not valid!");
        }
      }
      
      if (resolveSLA) {
        queryParams["resolveSLA"] = resolveSLA.title;
      }
      if (respondSLA) {
        queryParams["respondSLA"] = respondSLA.title;
      }
      if (SLAstatus) {
        queryParams["SLAstatus"] = SLAstatus.title;
      }
      let url = getBackendUrl();
      let queryString = Object.keys(queryParams)
        .map((key) => key + "=" + queryParams[key])
        .join("&");
      if (queryString !== "") {
        url += "?" + queryString;
      }
      const response = await Axios.get(url);

      if (response.data.length === 0) {
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  return (
    <>
    <div style={{ display: "flex", flexDirection: "row" }}>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { width: '10ch' },
      }}
      noValidate
      autoComplete="off"
    >
    <TextField
  id="INCIDENT_NUMBER"
  label="Incident Number"
  type="number"
  value={filters.incidentNumber || ''} 
  onChange={(event) => {
    const value = event.target.value;
    handleChange("incidentNumber", value === '' ? null : value);
  }}
  InputLabelProps={{
    shrink: true,
  }}
/>
    </Box>
      <Autocomplete
        id="Service"
        options={serviceOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.service}
        onChange={(event, newValue) => handleChange("service", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("service", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Service" />}
      />
      <Autocomplete
        id="Priority"
        options={priorityOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.priority}
        onChange={(event, newValue) => handleChange("priority", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("priority", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Priority" />}
      />
      <ClearableProp value={submitDate} handleDateChange={handleSubmitDateChange} />
      <ClearableProp value={resolvedDate} handleDateChange={handleResolvedDateChange} />
      <ClearableProp value={requiredResolutionDataTime} handleDateChange={handleRequiredDateChange} />
      <ClearableProp value={endOfImpact} handleDateChange={handleEndOfImpactDateChange} />
      <Autocomplete
        id="PendingDuration"
        options={pendingDurationOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.pendingDuration}
        onChange={(event, newValue) => handleChange("pendingDuration", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("pendingDuration", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="PendingDuration" />}
      />
      <Autocomplete
        id="ResolutionCategory"
        options={resolutionCategoryOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.resolutionCategory}
        onChange={(event, newValue) => handleChange("resolutionCategory", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("resolutionCategory", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="ResolutionCategory" />}
      />
      <Autocomplete
        id="Status"
        options={statusOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.status}
        onChange={(event, newValue) => handleChange("status", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("status", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Status" />}
      />
      
      
    </div>
    <div style={{ display: "flex", flexDirection: "row", paddingTop: "15px"}}>
    <Autocomplete
        id="Submitter"
        options={submitterOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.submitter}
        onChange={(event, newValue) => handleChange("submitter", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("submitter", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Submitter" />}
      />
      <Autocomplete
        id="AssignedGroup"
        options={assignedGroupOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.assignedGroup}
        onChange={(event, newValue) => handleChange("assignedGroup", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("assignedGroup", null);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Assigned Group" />
        )}
      />
      <Autocomplete
        id="Assignee"
        options={AssigneeOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.assignee}
        onChange={(event, newValue) => handleChange("assignee", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("assignee", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Assignee" />}
      />
      <Autocomplete
        id="Project"
        options={projectOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.project}
        onChange={(event, newValue) => handleChange("project", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("project", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Project" />}
      />
      <Autocomplete
        id="ResolveTime"
        options={resolveTimeOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.resolveTime}
        onChange={(event, newValue) => handleChange("resolveTime", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("resolveTime", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Resolve Time" />}
      />
      <Autocomplete
        id="PendingMinutes"
        options={pendingMinutesOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.pendingMinutes}
        onChange={(event, newValue) => handleChange("pendingMinutes", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("pendingMinutes", null);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Pending Minutes" />
        )}
      />
      <ClearableProp value={closeDate} handleDateChange={handleDateChange} />
      <Autocomplete
        id="ResolveSLA"
        options={resolveSLAOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.resolveSLA}
        onChange={(event, newValue) => handleChange("resolveSLA", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("resolveSLA", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Resolve SLA" />}
      />
      <Autocomplete
        id="RespondSLA"
        options={respondSLAOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.respondSLA}
        onChange={(event, newValue) => handleChange("respondSLA", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("respondSLA", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Respond SLA" />}
      />
      <Autocomplete
        id="SLAstatus"
        options={SLAstatusOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={filters.SLAstatus}
        onChange={(event, newValue) => handleChange("SLAstatus", newValue)}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            handleChange("SLAstatus", null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="SLA status" />}
      />
    </div>
    {showPopup && (
        <NoResultsPopup>
          <div class="btn-container">
            <button className="btn" onClick={CloseButtonHandler}>
              OK
            </button>
          </div>
        </NoResultsPopup>
      )}
    </>
  );
}
