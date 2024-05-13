import Axios from 'axios';

const BACKEND_URL = "http://localhost:80/api/";

export async function getTickets() {
    try {
      const response = await Axios.get(BACKEND_URL);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching tickets:", + error.message);
    }
  }

  export function getBackendUrl(){
    return BACKEND_URL;
  }

 

  
  
  