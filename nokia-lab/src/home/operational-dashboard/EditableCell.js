import React from "react";
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const EditableCell = ({ value, isEditing, onChange, columnId }) => {
  if (!isEditing) {
    return <TableCell>{value}</TableCell>;
  }

  return (
    <TableCell>
      {columnId === "SLA_STATUS" ? (
        <Select value={value} onChange={onChange} size="small">
          <MenuItem value="InSLA">InSLA</MenuItem>
          <MenuItem value="OutSLA">OutSLA</MenuItem>
        </Select>
      ) : columnId === "RESOLVE_SLA" || columnId === "RESPOND_SLA" ? (
        <Select value={value} onChange={onChange} size="small">
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      ) : (
        <TextField value={value} onChange={onChange} size="small" variant="outlined" />
      )}
    </TableCell>
  );
};

export default EditableCell;
