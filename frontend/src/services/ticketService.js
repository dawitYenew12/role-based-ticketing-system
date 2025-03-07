import axios from 'axios';

const API_URL = 'http://localhost:3000/v1/ticket';

export const ticketService = {
  getAllTickets: async (page = 1, limit = 10) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(
        `${API_URL}/all?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Failed to fetch tickets' };
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch tickets. Please try again later.' 
      };
    }
  },
  
  getUserTickets: async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(
        `${API_URL}/own`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Failed to fetch user tickets' };
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch tickets. Please try again later.' 
      };
    }
  },
  
  createTicket: async (ticketData) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.post(
        API_URL,
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (response.status === 201) {
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Failed to create ticket' };
    } catch (error) {
      console.error('Error creating ticket:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create ticket. Please try again later.' 
      };
    }
  },
  
  updateTicketStatus: async (ticketId, status) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.patch(
        `${API_URL}/${ticketId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (response.status === 200) {
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Failed to update ticket status' };
    } catch (error) {
      console.error('Error updating ticket status:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update ticket status. Please try again later.' 
      };
    }
  }
}; 