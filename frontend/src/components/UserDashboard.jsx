import React, { Component } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Modal, Button, message } from 'antd';
import { QueryClient } from '@tanstack/react-query';
import { validatePassword } from '../utils/validation';

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
      // Check if we have cached data
      const cachedData = await this.queryClient.getQueryData(['userTickets']);
      if (cachedData) {
        this.setState({
          tickets: cachedData.tickets,
          isLoading: false,
        });
        return;
      }

      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:3000/v1/ticket/own', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 && response.data.sucess) {
        const tickets = Array.isArray(response.data.data.tickets)
          ? response.data.data.tickets
          : [];

        // Cache the data
        await this.queryClient.setQueryData(['userTickets'], {
          tickets,
        });

        this.setState({
          tickets,
          isLoading: false,
        });
      }
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
      const accessToken = localStorage.getItem('access_token');
      const decodedToken = jwtDecode(accessToken);
      const createdBy = decodedToken.subject;

      const response = await axios.post(
        'http://localhost:3000/v1/ticket',
        { title, description, createdBy },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 201) {
        // Invalidate the cache and refetch
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
      }
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
          {tickets.length > 0 ? (
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticket.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                        {ticket.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          ticket.status === 'OPEN'
                            ? 'bg-green-100 text-green-800'
                            : ticket.status === 'IN_PROGRESS'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No tickets yet.</p>
            </div>
          )}
          <Modal
            title="Create New Ticket"
            open={isModalVisible}
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
          >
            <div className="mb-4">
              <label className="block mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={this.handleChange}
                className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={description}
                onChange={this.handleChange}
                className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
            {successMessage && (
              <p className="text-green-500 mt-4">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}
          </Modal>
        </div>
      </>
    );
  }
}

export default UserDashboard;
