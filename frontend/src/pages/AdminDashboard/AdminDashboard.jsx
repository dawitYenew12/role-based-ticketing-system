import React, { Component } from 'react';
import { QueryClient } from '@tanstack/react-query';
import TicketTable from '../../components/AdminDashboard/TicketTable';
import StatusModal from '../../components/AdminDashboard/StatusModal';
import RegisterModal from '../../components/AdminDashboard/RegisterModal';
import Pagination from '../../components/AdminDashboard/Pagination';
import { fetchTickets, updateTicketStatus, registerUser } from '../../services/api';
import { message } from 'antd';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      selectedStatus: '',
      selectedTicketId: null,
      isStatusModalVisible: false,
      isRegisterModalVisible: false,
      isLoading: true,
      error: null,
    };
    this.queryClient = new QueryClient();
  }

  componentDidMount() {
    this.fetchTickets();
  }

  fetchTickets = async () => {
    try {
      // Always fetch fresh data to get accurate total count
      const result = await fetchTickets(this.state.currentPage, this.state.pageSize);
      const { tickets, totalCount, totalPages } = result;
      
      // Update cache with new data
      await this.queryClient.setQueryData(['tickets', this.state.currentPage], {
        tickets,
        totalPages,
        totalCount
      });


      this.setState({
        tickets,
        totalPages,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      this.setState({
        tickets: [],
        totalPages: 1,
        isLoading: false,
        error: 'Failed to fetch tickets',
      });
    }
  };

  handleStatusUpdate = async () => {
    const { selectedTicketId, selectedStatus } = this.state;
    try {
      await updateTicketStatus(selectedTicketId, selectedStatus);
      await this.queryClient.invalidateQueries(['tickets']);
      this.setState({ isStatusModalVisible: false });
      this.fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      message.error('Failed to update ticket status');
    }
  };

  showStatusModal = (ticketId) => {
    this.setState({
      selectedTicketId: ticketId,
      isStatusModalVisible: true,
    });
  };

  handleStatusModalCancel = () => {
    this.setState({
      isStatusModalVisible: false,
      selectedTicketId: null,
      selectedStatus: '',
    });
  };

  handleStatusChange = (value) => {
    this.setState({ selectedStatus: value });
  };

  handlePageChange = (newPage) => {
    this.setState({ currentPage: newPage }, () => {
      this.fetchTickets();
    });
  };

  showRegisterModal = () => {
    this.setState({ isRegisterModalVisible: true });
  };

  handleRegisterCancel = () => {
    this.setState({ isRegisterModalVisible: false });
  };

  handleRegisterSubmit = async (values) => {
    try {
      await registerUser(values);
      this.setState({ isRegisterModalVisible: false });
      await this.queryClient.invalidateQueries(['tickets']);
      this.fetchTickets();
      message.success('User registered successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Failed to register user. Please try again.');
    }
  };

  render() {
    const { 
      currentPage, 
      totalPages, 
      isStatusModalVisible, 
      selectedStatus, 
      isRegisterModalVisible,
      isLoading,
      error 
    } = this.state;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading tickets...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-red-500">{error}</div>
        </div>
      );
    }

    const currentTickets = this.state.tickets;

    return (
      <>
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between w-[1200px] mx-auto">
              <div className="flex items-center space-x-4">
                <div className="p-[6px] bg-[#e7f1ff] rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-blue-100 text-sm">
                    Manage all support tickets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 w-[1100px] mx-auto mt-12">
          <div className="flex justify-end items-center mb-4">
            <button
              onClick={this.showRegisterModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Register
            </button>
          </div>
          <TicketTable 
            tickets={currentTickets} 
            showStatusModal={this.showStatusModal} 
          />
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            handlePageChange={this.handlePageChange} 
          />
        </div>

        <StatusModal 
          isVisible={isStatusModalVisible} 
          selectedStatus={selectedStatus} 
          handleStatusChange={this.handleStatusChange} 
          handleStatusUpdate={this.handleStatusUpdate} 
          handleCancel={this.handleStatusModalCancel} 
        />

        <RegisterModal 
          isVisible={isRegisterModalVisible} 
          handleSubmit={this.handleRegisterSubmit} 
          handleCancel={this.handleRegisterCancel} 
        />
      </>
    );
  }
}

export default AdminDashboard;