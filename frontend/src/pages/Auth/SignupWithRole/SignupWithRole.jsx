import React, { Component } from 'react';
import axios from 'axios';
import { withNavigation } from '../../../utils/withNavigation.jsx';
import { NavigationContext } from '../../../context/NavigationContext.jsx';

class SignupWithRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      role: '',
      showDropdown: false,
      successMessage: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  }

  selectRole = (role) => {
    this.setState({ role, showDropdown: false });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = this.state;
    try {
      const response = await axios.post('http://localhost:3000/v1/auth/signup-with-role', { email, password, role });
      if (response.status === 201 && response.data.success) {
        this.setState({ successMessage: 'Successfully registered!' });
        alert('Successfully registered!');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed');
    }
  }

  render() {
    const { email, password, role, showDropdown, successMessage } = this.state;
    return (
      <NavigationContext.Consumer>
        {navigate => (
          <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={this.handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
              <h2 className="text-2xl mb-4">Signup with Role</h2>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input type="email" name="email" value={email} onChange={this.handleChange} className="w-full border border-gray-300 p-2 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input type="password" name="password" value={password} onChange={this.handleChange} className="w-full border border-gray-300 p-2 rounded" required />
              </div>
              <div className="mb-4 relative">
                <label className="block mb-1">Role</label>
                <div className="border border-gray-300 p-2 rounded cursor-pointer" onClick={this.toggleDropdown}>
                  {role || 'Select a role'}
                </div>
                {showDropdown && (
                  <div className="absolute bg-white border border-gray-300 rounded mt-1 w-full">
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => this.selectRole('admin')}>Admin</div>
                    <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => this.selectRole('user')}>User</div>
                  </div>
                )}
              </div>
              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Signup</button>
              {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            </form>
          </div>
        )}
      </NavigationContext.Consumer>
    );
  }
}

export default withNavigation(SignupWithRole); 