import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Button, Select, Form, Input, message } from 'antd';
// import { withNavigation } from './withNavigation';
// import { NavigationContext } from './NavigationContext';

const { Option } = Select;

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
    };
    this.registerForm = React.createRef();
  }

  componentDidMount() {
    this.fetchTickets();
  }

  fetchTickets = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(
        `http://localhost:3000/v1/ticket/all?page=${this.state.currentPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data);
      if (response.status === 200 && response.data.sucess === true) {
        // Ensure tickets is an array
        const tickets = Array.isArray(response.data.data.tickets)
          ? response.data.data.tickets
          : [];
        const totalPages = Math.ceil(tickets.length / this.state.pageSize);
        this.setState({
          tickets,
          totalPages,
        });
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Initialize with empty array if there's an error
      this.setState({
        tickets: [],
        totalPages: 1,
      });
    }
  };

  handleStatusUpdate = async () => {
    const { selectedTicketId, selectedStatus } = this.state;
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.put(
        `http://localhost:3000/v1/ticket/${selectedTicketId}`,
        { status: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        this.setState({ isStatusModalVisible: false });
        this.fetchTickets();
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  showStatusModal = (ticketId) => {
    this.setState(
      {
        selectedTicketId: ticketId,
        isStatusModalVisible: true,
      },
      () => {},
    );
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
    this.setState({ currentPage: newPage });
  };

  navigateToSignup = (navigate) => {
    navigate('/signup-with-role');
  };

  getCurrentPageTickets = () => {
    const { tickets, currentPage, pageSize } = this.state;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return tickets.slice(startIndex, endIndex);
  };

  showModal = () => {
    this.setState({ isRegisterModalVisible: true });
  };

  handleRegisterCancel = () => {
    this.setState({ isRegisterModalVisible: false });
  };

  handleRegisterSubmit = async () => {
    try {
      const values = await this.registerForm.current.validateFields();
      const accessToken = localStorage.getItem('access_token');
      
      const response = await axios.post(
        'http://localhost:3000/v1/auth/signup-with-role',
        {
          email: values.email,
          password: values.password,
          role: values.role
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        message.success('User registered successfully!');
        this.setState({ isRegisterModalVisible: false });
        this.registerForm.current.resetFields();
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Failed to register user. Please try again.');
    }
  };

  render() {
    const { currentPage, totalPages, isStatusModalVisible, selectedStatus, isRegisterModalVisible } =
      this.state;

    const currentTickets = this.getCurrentPageTickets();

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
            <Button type="primary" onClick={this.showModal}>
              Register
            </Button>
          </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTickets.map((ticket) => (
                  <tr
                    key={ticket._id}
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
                              ticket.status.toUpperCase() === 'OPEN'
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        type="primary"
                        onClick={() => this.showStatusModal(ticket._id)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Button
              onClick={() => this.handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => this.handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>

        <Modal
          title="Update Ticket Status"
          open={isStatusModalVisible}
          onOk={this.handleStatusUpdate}
          onCancel={this.handleStatusModalCancel}
        >
          <Select
            style={{ width: '100%' }}
            placeholder="Select new status"
            value={selectedStatus}
            onChange={this.handleStatusChange}
          >
            <Option value="OPEN">Open</Option>
            <Option value="IN_PROGRESS">In Progress</Option>
            <Option value="CLOSED">Closed</Option>
          </Select>
        </Modal>

        <Modal
          title="Register New User"
          open={isRegisterModalVisible}
          onCancel={this.handleRegisterCancel}
          footer={[
            <Button key="cancel" onClick={this.handleRegisterCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleRegisterSubmit}>
              Register
            </Button>,
          ]}
        >
          <Form
            ref={this.registerForm}
            layout="vertical"
            name="register_form"
          >
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
            
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
            
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select placeholder="Select user role">
                <Option value="admin">Admin</Option>
                <Option value="user">User</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default AdminDashboard;
