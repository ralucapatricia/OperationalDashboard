import React, { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Typography, Modal } from '@mui/material';
import { CSVLink } from 'react-csv';
import { SaveAlt as SaveAltIcon } from '@mui/icons-material';

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


const PopUp = ({ openData, handleClose }) => {

  const headers = openData.tableData.columns ? openData.tableData.columns.map(column => ({
    label: column.label,
    key: column.id
  })) : [];

  const data = openData.tableData.content ? openData.tableData.content.map(row => {
    let formattedRow = {};
    openData.tableData.columns.forEach(column => {
      formattedRow[column.id] = row[column.label];
    });
    return formattedRow;
  }) : [];

  return (
    <Modal
      open={openData.open}
      onClose={handleClose}
    >
      <Box sx={style}>
      <CSVLink
              data={data}
              headers={headers}
              filename="table_data.csv"
              style={{ textDecoration: 'none' }}
              className="d-flex justify-content-end"
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveAltIcon />}
              >
                Export to CSV
              </Button>
            </CSVLink>
        <Typography variant="h6" component="h2" className="p-3 mb-3">
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
                              {value}
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
  )
}

export default PopUp;