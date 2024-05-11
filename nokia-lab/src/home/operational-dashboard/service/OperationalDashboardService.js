import Axios from 'axios';

const BACKEND_URL = "http://localhost:80/api/";

export async function getTickets() {
    try {
      const response = await Axios.get(BACKEND_URL);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching tickets:", error);
    }
  }

  export function getBackendUrl(){
    return BACKEND_URL;
  }

  async function fetchFilteredData(queryParams) {
    try {
      let url = BACKEND_URL;
      let queryString = Object.keys(queryParams)
        .map((key) => key + "=" + queryParams[key])
        .join("&");
      if (queryString !== "") {
        url += "?" + queryString;
      }
      const response = await Axios.get(url);
      return response.data; 
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      throw error; 
    }
  }

  
  
  