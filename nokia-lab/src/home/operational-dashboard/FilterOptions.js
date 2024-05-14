import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Axios from "axios";
import ClearableProp from "./ClearableProp";
import NoResultsPopup from "./NoResultsPopup";
import "./NoResultsPopup.css";
import {
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

export default function FilterOptions({ setFilteredData, filterType }) {
  const [filters, setFilters] = useState({
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
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (field, newValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: newValue,
      closeDate: closeDate,
    }));
    fetchFilteredData({ ...filters, [field]: newValue, closeDate: closeDate });
  };

  const handleDateChange = (newValue) => {
    setCloseDate(newValue);
    fetchFilteredData({ ...filters, closeDate: newValue });
  };

  function CloseButtonHandler() {
    setShowPopup(false);
    const fieldsToReset = [
      "submitter",
      "assignedGroup",
      "assignee",
      "project",
      "resolveTime",
      "pendingMinutes",
      "resolveSLA",
      "respondSLA",
      "SLAstatus",
    ];
    fieldsToReset.forEach((field) => {
      handleChange(field, null);
    });
    setCloseDate(null);
  }

  const fetchFilteredData = async ({
    submitter,
    assignedGroup,
    assignee,
    project,
    resolveTime,
    pendingMinutes,
    closeDate,
    resolveSLA,
    respondSLA,
    SLAstatus,
  }) => {
    try {
      let queryParams = {};
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
      if(filterType === 'all') {
        setFilteredData(response.data);
      } else if(filterType === 'open') {
        setFilteredData(response.data.filter((ticket) => ticket.days > 0));
      } else {
        setFilteredData(response.data.filter((ticket) => ticket.days < 0));
      }
      
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
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
      {showPopup && (
        <NoResultsPopup message={'No results found!'}>
          <div class="btn-container">
            <button className="btn" onClick={CloseButtonHandler}>
              OK
            </button>
          </div>
        </NoResultsPopup>
      )}
    </div>
  );
}
