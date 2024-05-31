import React from "react";
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

const EditableCell = ({
  value,
  isEditing,
  editEnabled,
  onEditClick,
  onSaveClick,
  onChange,
  columnId,
}) => {
  return (
    <TableCell>
      {isEditing ? (
        <div>
          {columnId === "SLA_STATUS" ? (
            <Select value={value} onChange={onChange} size="small">
              <MenuItem value="InSLA">InSLA</MenuItem>
              <MenuItem value="OutSLA">OutSLA</MenuItem>
            </Select>
          ) : columnId === "RESOLVE_SLA" ? (
            <Select value={value} onChange={onChange} size="small">
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          ) : columnId === "RESPOND_SLA" ? (
            <Select value={value} onChange={onChange} size="small">
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          ) : (
            <TextField
              value={value}
              onChange={onChange}
              size="small"
              variant="outlined"
            />
          )}

          <div style={{ display: "flex", justifyContent: "center" }}>
            <IconButton onClick={onSaveClick} size="small" color="primary">
              <SaveIcon />
            </IconButton>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>{value}</div>
          {editEnabled && (
            <IconButton onClick={onEditClick} size="small" color="primary">
              <EditIcon />
            </IconButton>
          )}
        </div>
      )}
    </TableCell>
  );
};

export default EditableCell;
