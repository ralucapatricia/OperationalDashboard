import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Axios from 'axios';

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option) => option.title,
});

export default function FilterOptions({ setFilteredData }) {
  const [submitter, setSubmitter] = useState(null);

  const handleChangeSubmitter = (event, newValue) => {
    setSubmitter(newValue);
    fetchFilteredData(newValue); 
  };

  const fetchFilteredData = (newValue) => {
    let queryParams = {};
    if (newValue) {
      queryParams['submitter'] = newValue.title;
    }
    let url = 'http://localhost:80/api/';
    let queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
    if (queryString !== '') {
      url += '?' + queryString;
    }
    Axios.get(url)
      .then((response) => {
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching filtered data:', error);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Autocomplete
        id="Submitter"
        options={submitterOptions}
        getOptionLabel={(option) => option.title}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        value={submitter}
        onChange={handleChangeSubmitter}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) { 
            fetchFilteredData(null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Submitter" />}
      />
    </div>
  );
}

const submitterOptions = [
  { title: 'John Smith' },
  { title: 'Emily R.' },
  { title: 'Michael B.' },
];
