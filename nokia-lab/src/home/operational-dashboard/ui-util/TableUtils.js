export const columns = [
  {
    id: "EDIT",
    label: "Editing",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "TIME_REMAINING",
    label: "Time remaining",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  { id: "INCIDENT_NUMBER", label: "Incident number", minWidth: 170 },
  { id: "SERVICE", label: "Service", minWidth: 100 },
  {
    id: "PRIORITY",
    label: "Priority",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "SUBMIT_DATE",
    label: "Submit date",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
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
    id: "PENDING_DURATION",
    label: "Pending duration",
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
    id: "PENDING_MINUTES",
    label: "Pending Minutes",
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

  export const serviceOptions = [
    { title: "Network" },
    { title: "IT Support" },
    { title: "Maintenance" },
  ];

  export const priorityOptions = [
    { title: "1" },
    { title: "2" },
    { title: "3" },
  ];

  export const pendingDurationOptions = [
    { title: "90" },
    { title: "80" },
    { title: "110" },
  ];

  export const resolutionCategoryOptions = [
    { title: "Software Issue" },
    { title: "Connectivity" },
    { title: "Hardware" },
    { title: "Bug Report" },
    
  ];

  export const statusOptions = [
    { title: "Assigned" },
    { title: "Pending" },
    { title: "In Progress" },
    { title: "Resolved" },
  
  ];

 export const submitterOptions = [
    { title: "John Smith" },
    { title: "Emily R." },
    { title: "Michael B." },
  ];
  
 export const assignedGroupOptions = [
    { title: "Support Team A" },
    { title: "Network Team" },
    { title: "Maintenance Crew" },
  ];
 export  const AssigneeOptions = [
    { title: "Alice Johnson" },
    { title: "Bob Williams" },
    { title: "JohnDoe" },
  ];
 export const projectOptions = [
    { title: "Project Gamma" },
    { title: "Project Kappa" },
    { title: "Project Lambda" },
  ];
 export const resolveTimeOptions = [{ title: "45" }, { title: "60" }, { title: "35" }];
  
 export const pendingMinutesOptions = [
    { title: "210" },
    { title: "300" },
    { title: "190" },
  ];
 export const resolveSLAOptions = [{ title: "Yes" }, { title: "No" }];
 export const respondSLAOptions = [{ title: "Yes" }, { title: "No" }];
 export const SLAstatusOptions = [{ title: "InSLA" }, { title: "OutSLA" }];
  
