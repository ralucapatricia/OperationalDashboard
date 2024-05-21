import Axios from 'axios';

const BACKEND_URL = "http://localhost:80/api/";


// export async function getTickets() {
//   try {
//     const response = await Axios.get(BACKEND_URL);
//     return response.data;
//   } catch (Error) {
//     console.error("Eroare la obținerea tichetelor:", Error);
//     throw new Error("Error fetching tickets:", + Error.message);
//   }
// }
export async function getTickets() {
  try {
    const response = await fetch(BACKEND_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Eroare la obținerea tichetelor:", error);
    throw new Error("Error fetching tickets:", error.message);
  }
}

  export function getBackendUrl(){
    return BACKEND_URL;
  }

export const formatDate = (date) => {
  const dateObject = new Date(date);
  if (!isNaN(dateObject.getTime())) {
    const year = dateObject.getFullYear();
    const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObject.getDate()).slice(-2);
    const hours = ("0" + dateObject.getHours()).slice(-2);
    const minutes = ("0" + dateObject.getMinutes()).slice(-2);
    const seconds = ("0" + dateObject.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } else {
    console.error(`${date} is not a valid date!`);
    return null;
  }
};
 

  
  
  