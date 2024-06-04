import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Axios from "axios";
import ClearableProp from "./ClearableProp";
import Box from "@mui/material/Box";
import NoResultsPopup from "./NoResultsPopup";
import { formatDate } from "./service/OperationalDashboardService";
import "./NoResultsPopup.css";
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
import { getOptions } from "./service/OperationalDashboardService";

const filterOptions = (options, params) => {
  return options;
};

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
  const [priority, setPriorirty] = useState({});
  useEffect(() => {
    async function fetchOptions() {
      try {
        const options = await getOptions();
        setPriorirty(options);
      } catch (error) {
        console.error("Error fetching the options:", error);
      }
    }
    fetchOptions();
  }, [priority]);

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
            "& .MuiTextField-root": { width: "10ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="INCIDENT_NUMBER"
            label="Number"
            type="number"
            value={filters.incidentNumber || ""}
            onChange={(event) => {
              const value = event.target.value;
              handleChange("incidentNumber", value === "" ? null : value);
            }}
            placeholder="Incident Number"
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
        <ClearableProp
          value={dates.submitDate}
          handleDateChange={(newValue) =>
            handleDateChange("submitDate", newValue)
          }
          label="Submit Date"
        />
        <ClearableProp
          value={dates.resolvedDate}
          handleDateChange={(newValue) =>
            handleDateChange("resolvedDate", newValue)
          }
          label="Resolved Date"
        />
        <ClearableProp
          value={dates.requiredResolutionDataTime}
          handleDateChange={(newValue) =>
            handleDateChange("requiredResolutionDataTime", newValue)
          }
          label="Required Resolution Date"
        />
        <ClearableProp
          value={dates.endOfImpact}
          handleDateChange={(newValue) =>
            handleDateChange("endOfImpact", newValue)
          }
          label="End Of Impact Date"
        />
        <Autocomplete
          id="PendingDuration"
          options={pendingDurationOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 300 }}
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
            <TextField {...params} label="PendingDuration" />
          )}
        />
        <Autocomplete
          id="ResolutionCategory"
          options={resolutionCategoryOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 300 }}
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
            <TextField {...params} label="ResolutionCategory" />
          )}
        />
        <Autocomplete
          id="Status"
          options={statusOptions}
          getOptionLabel={(option) => option.title}
          filterOptions={filterOptions}
          sx={{ width: 300 }}
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
        style={{ display: "flex", flexDirection: "row", paddingTop: "15px" }}
      >
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
          renderInput={(params) => (
            <TextField {...params} label="Resolve Time" />
          )}
        />
        <Autocomplete
          id="PendingMinutes"
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
          handleDateChange={(newValue) =>
            handleDateChange("closeDate", newValue)
          }
          label="Close Date"
        />
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
          renderInput={(params) => (
            <TextField {...params} label="Resolve SLA" />
          )}
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
          renderInput={(params) => (
            <TextField {...params} label="Respond SLA" />
          )}
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
        <NoResultsPopup message="No tickets found!">
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
              onClick={CloseButtonHandler}
            >
              Ok
            </button>
          </div>
        </NoResultsPopup>
      )}
    </>
  );
}
