import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Axios from "axios";
import ClearableProp from "./ClearableProp";
import Box from "@mui/material/Box";
import NoResultsPopup from "./NoResultsPopup";
import { formatDate } from "./service/OperationalDashboardService";
import "./NoResultsPopup.css";
import "./FilterOptions.css";
import {
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

export default function FilterOptions({ setFilteredData, filterType }) {
  const [filters, setFilters] = useState({
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
  const [dates, setDates] = useState({
    closeDate: null,
    submitDate: null,
    resolvedDate: null,
    requiredResolutionDataTime: null,
    endOfImpact: null,
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (field, newValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: newValue,
    }));
    fetchFilteredData({ ...filters, [field]: newValue, ...dates });
  };

  const handleDateChange = (field, newValue) => {
    setDates((prevDates) => ({
      ...prevDates,
      [field]: newValue,
    }));
    fetchFilteredData({ ...filters, ...dates, [field]: newValue });
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
    setDates({
      closeDate: null,
      submitDate: null,
      resolvedDate: null,
      requiredResolutionDataTime: null,
      endOfImpact: null,
    });
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
      if (incidentNumber) {
        queryParams["incidentNumber"] = incidentNumber;
      }
      if (service) {
        queryParams["service"] = service.title;
      }
      if (priority) {
        queryParams["priority"] = priority.title;
      }
      if (pendingDuration) {
        queryParams["pendingDuration"] = pendingDuration.title;
      }
      if (resolutionCategory) {
        queryParams["resolutionCategory"] = resolutionCategory.title;
      }
      if (statusOptions) {
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
        const formattedCloseDate = formatDate(closeDate);
        queryParams["closeDate"] = formattedCloseDate;
      }
      if (submitDate) {
        const formattedSubmitDate = formatDate(submitDate);
        queryParams["submitDate"] = formattedSubmitDate;
      }
      if (requiredResolutionDataTime) {
        const formattedRequiredResolutionDataTime = formatDate(
          requiredResolutionDataTime
        );
        queryParams["requiredResolutionDataTime"] =
          formattedRequiredResolutionDataTime;
      }
      if (resolvedDate) {
        const formattedResolvedDate = formatDate(resolvedDate);
        queryParams["resolvedDate"] = formattedResolvedDate;
      }
      if (endOfImpact) {
        const formattedEndOfImpact = formatDate(endOfImpact);
        queryParams["endOfImpact"] = formattedEndOfImpact;
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
      let shouldShowPopup = true;
      if (
        incidentNumber &&
        !service &&
        !priority &&
        !pendingDuration &&
        !resolutionCategory &&
        !statusOptions &&
        !submitter &&
        !assignedGroup &&
        !assignee &&
        !project &&
        !resolveTime &&
        !pendingMinutes &&
        !closeDate &&
        !submitDate &&
        !resolvedDate &&
        !endOfImpact &&
        !requiredResolutionDataTime &&
        !resolveSLA &&
        !respondSLA &&
        !SLAstatus
      ) {
        shouldShowPopup = false;
      }
      if (response.data.length === 0 && shouldShowPopup) {
        setShowPopup(true);
        setFilteredData([]);
      } else {
        setShowPopup(false);
        if (filterType === "all") {
          setFilteredData(response.data);
        } else if (filterType === "open") {
          const openTickets = response.data.filter(
            (ticket) => ticket.is_pending === true && ticket.days > 0
          );
          if (openTickets.length === 0 && shouldShowPopup) {
            setShowPopup(true);
          }
          setFilteredData(openTickets);
        } else if (filterType === "closed") {
          const closedTickets = response.data.filter(
            (ticket) => ticket.days <= 0
          );
          if (closedTickets.length === 0 && shouldShowPopup) {
            setShowPopup(true);
          }
          setFilteredData(closedTickets);
        } else {
          setFilteredData(response.data.filter((ticket) => ticket.days < 0));
        }
      }
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
            "& .MuiTextField-root": { width: "75px"},
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="INCIDENT_NUMBER"
            label="Number"
            size = "small"
            type="number"
            value={filters.incidentNumber || ""}
            onChange={(event) => {
              const value = event.target.value;
              handleChange("incidentNumber", value === "" ? null : value);
            }}
            placeholder="Nr"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Autocomplete
          id="Service"
          size = "small"
          options={serviceOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 175 }}
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
          size = "small"
          options={priorityOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 175 }}
          value={filters.priority}
          onChange={(event, newValue) => handleChange("priority", newValue)}
          onInputChange={(event, newInputValue) => {
            if (!newInputValue) {
              handleChange("priority", null);
            }
          }}
          renderInput={(params) => <TextField {...params} label="Priority" />}
        />
        <ClearableProp
          value={dates.submitDate}
          size = "small"
          handleDateChange={(newValue) =>
            handleDateChange("submitDate", newValue)
          }
          label="Submit"
        />
        <ClearableProp
          value={dates.resolvedDate}
          size = "small"
          handleDateChange={(newValue) =>
            handleDateChange("resolvedDate", newValue)
          }
          label="Resolved"
        />
        <ClearableProp
          value={dates.requiredResolutionDataTime}
          size = "small"
          handleDateChange={(newValue) =>
            handleDateChange("requiredResolutionDataTime", newValue)
          }
          label="RRT"
        />
        <ClearableProp
          value={dates.endOfImpact}
          size = "small"
          handleDateChange={(newValue) =>
            handleDateChange("endOfImpact", newValue)
          }
          label="EOI"
        />
        <Autocomplete
          id="PendingDuration"
          size = "small"
          options={pendingDurationOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 175 }}
          value={filters.pendingDuration}
          onChange={(event, newValue) =>
            handleChange("pendingDuration", newValue)
          }
          onInputChange={(event, newInputValue) => {
            if (!newInputValue) {
              handleChange("pendingDuration", null);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Pending" />
          )}
        />
        <Autocomplete
          id="ResolutionCategory"
          size = "small"
          options={resolutionCategoryOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 175 }}
          value={filters.resolutionCategory}
          onChange={(event, newValue) =>
            handleChange("resolutionCategory", newValue)
          }
          onInputChange={(event, newInputValue) => {
            if (!newInputValue) {
              handleChange("resolutionCategory", null);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Category" />
          )}
        />
        <Autocomplete
          id="Status"
          size = "small"
          options={statusOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 175 }}
          value={filters.status}
          onChange={(event, newValue) =>
            handleChange("statusOptions", newValue)
          }
          onInputChange={(event, newInputValue) => {
            if (!newInputValue) {
              handleChange("statusOptions", null);
            }
          }}
          renderInput={(params) => <TextField {...params} label="Status" />}
        />
      </div>
      <div
        style={{ display: "flex", flexDirection: "row" }}
      >
        <Autocomplete
          id="Submitter"
          size = "small"
          options={submitterOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 175 }}
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
          size = "small"
          options={assignedGroupOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 175 }}
          value={filters.assignedGroup}
          onChange={(event, newValue) =>
            handleChange("assignedGroup", newValue)
          }
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
          size = "small"
          options={AssigneeOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 175 }}
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
          size = "small"
          options={projectOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 175 }}
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
          size = "small"
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
          renderInput={(params) => (
            <TextField {...params} label="Resolve Time" />
          )}
        />
        <Autocomplete
          id="PendingMinutes"
          size = "small"
          options={pendingMinutesOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 300 }}
          value={filters.pendingMinutes}
          onChange={(event, newValue) =>
            handleChange("pendingMinutes", newValue)
          }
          onInputChange={(event, newInputValue) => {
            if (!newInputValue) {
              handleChange("pendingMinutes", null);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Pending Minutes" />
          )}
        />
        <ClearableProp
          value={dates.closeDate}
          size = "small"
          handleDateChange={(newValue) =>
            handleDateChange("closeDate", newValue)
          }
          label="Close Date"
        />
        <Autocomplete
          id="ResolveSLA"
          size = "small"
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
          renderInput={(params) => (
            <TextField {...params} label="Resolve SLA" />
          )}
        />
        <Autocomplete
          id="RespondSLA"
          size = "small"
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
          renderInput={(params) => (
            <TextField {...params} label="Respond SLA" />
          )}
        />
        <Autocomplete
          id="SLAstatus"
          size = "small"
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
        <NoResultsPopup message="No tickets found!">
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
