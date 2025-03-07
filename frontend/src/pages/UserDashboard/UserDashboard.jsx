import React, { Component } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import TicketTable from '../../components/UserDashboard/TicketTable';
import CreateTicketModal from '../../components/UserDashboard/CreateTicketModal';
import { fetchUserTickets, createTicket } from '../../services/api';
import { message } from 'antd';

class UserDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      title: '',
      description: '',
      successMessage: '',
      errorMessage: '',
      isModalVisible: false,
      isLoading: true,
      error: null,
      errors: {
        title: '',
        description: ''
      }
    };
    this.queryClient = new QueryClient();
  }

  componentDidMount() {
    this.fetchTickets();
  }

  fetchTickets = async () => {
    try {
      const cachedData = await this.queryClient.getQueryData(['userTickets']);
      if (cachedData) {
        this.setState({
          tickets: cachedData.tickets,
          isLoading: false,
        });
        return;
      }

      const tickets = await fetchUserTickets();
      await this.queryClient.setQueryData(['userTickets'], {
        tickets,
      });

      this.setState({
        tickets,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      this.setState({
        tickets: [],
        isLoading: false,
        error: 'Failed to fetch tickets',
      });
    }
  };

  validateFields = () => {
    const { title, description } = this.state;
    const errors = {
      title: '',
      description: ''
    };

    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }

    if (!description.trim()) {
      errors.description = 'Description is required';
    } else if (description.length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }

    return {
      isValid: !errors.title && !errors.description,
      errors
    };
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ 
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: ''  // Clear error when user starts typing
      }
    });
  };

  handleSubmit = async () => {
    const { title, description } = this.state;
    
    // Validate fields
    const { isValid, errors } = this.validateFields();
    if (!isValid) {
      this.setState({ errors });
      message.error('Please fix the form errors');
      return;
    }

    try {
      await createTicket({ title, description });
      await this.queryClient.invalidateQueries(['userTickets']);
      
      this.setState({
        title: '',
        description: '',
        successMessage: 'Ticket created successfully!',
        errorMessage: '',
        isModalVisible: false,
      });
      
      this.fetchTickets();
      message.success('Ticket created successfully!');
    } catch (error) {
      console.error('Ticket creation error:', error);
      this.setState({
        errorMessage: 'Failed to create ticket.',
        successMessage: '',
      });
      message.error('Failed to create ticket');
    }
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
      title: '',
      description: '',
      successMessage: '',
      errorMessage: '',
    });
  };

  render() {
    const {
      tickets,
      title,
      description,
      successMessage,
      errorMessage,
      isModalVisible,
      isLoading,
      error,
      errors
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

    return (
      <>
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-4 w-[1200px] mx-auto">
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
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-blue-100 text-sm">
                  Manage your support tickets
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 w-[1100px] mx-auto mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-[#081f5c] font-bold">My Tickets</h2>
            <Button type="primary" onClick={this.showModal}>
              Create Ticket
            </Button>
          </div>
          <TicketTable tickets={tickets} />
          <CreateTicketModal 
            isVisible={isModalVisible} 
            title={title}
            description={description}
            errors={errors}
            successMessage={successMessage}
            errorMessage={errorMessage}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            handleCancel={this.handleCancel}
          />
        </div>
      </>
    );
  }
}

export default UserDashboard;