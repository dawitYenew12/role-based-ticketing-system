import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:3000/v1';

export const fetchTickets = async (page, limit) => {
  const accessToken = localStorage.getItem('access_token');
  const response = await axios.get(`${API_BASE_URL}/ticket/all?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }); 
  console.log(response.data);
  return {
    tickets: response.data.data.tickets,
    totalCount: response.data.data.totalTickets || response.data.data.tickets.length,
    totalPages: response.data.data.totalPages
  };
};

export const updateTicketStatus = async (ticketId, status) => {
  const accessToken = localStorage.getItem('access_token');
  const response = await axios.put(
    `${API_BASE_URL}/ticket/${ticketId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export const registerUser = async (userData) => {
  const accessToken = localStorage.getItem('access_token');
  const response = await axios.post(
    `${API_BASE_URL}/auth/signup-with-role`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export const fetchUserTickets = async () => {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.get(`${API_BASE_URL}/ticket/own`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data.tickets;
  };
  
  export const createTicket = async (ticketData) => {
    const accessToken = localStorage.getItem('access_token');
    const decodedToken = jwtDecode(accessToken);
    const createdBy = decodedToken.subject;
  
    const response = await axios.post(
      `${API_BASE_URL}/ticket`,
      { ...ticketData, createdBy },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  };