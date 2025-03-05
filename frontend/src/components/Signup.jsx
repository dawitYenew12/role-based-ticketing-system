import React, { Component } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { withNavigation } from './withNavigation';
import { NavigationContext } from './NavigationContext';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  togglePasswordVisibility = () => {
    this.setState({ showPassword: !this.state.showPassword });
  }

  toggleConfirmPasswordVisibility = () => {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  }

  handleSubmit = async (e, navigate) => {
    e.preventDefault();
    const { email, password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
        console.log(email, password);
      const response = await axios.post('http://localhost:3000/v1/auth/signup', { email, password });
      if (response.status === 201 && response.data.success) {
        alert(response.data.message);
        const loginResponse = await axios.post('http://localhost:3000/v1/auth/login', { email, password });
        if (loginResponse.status === 200 && loginResponse.data.success) {
          const token = loginResponse.data.token.access.token;
          console.log("token: ", token);
          document.cookie = `access=${token}; path=/`;
          const decodedToken = jwtDecode(token);
          console.log("decodedToken: ", decodedToken);
          const role = decodedToken.role;
          if (role === 'admin') {
            navigate('/adminDashboard');
          } else {
            navigate('/userDashboard');
          }
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed');
    }
  }

  render() {
    return (
      <NavigationContext.Consumer>
        {navigate => (
          <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={(e) => this.handleSubmit(e, navigate)} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
              <h2 className="text-2xl mb-4">Signup</h2>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input type="email" name="email" value={this.state.email} onChange={this.handleChange} className="w-full border border-gray-300 p-2 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={this.state.showPassword ? 'text' : 'password'}
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                  <button type="button" onClick={this.togglePasswordVisibility} className="absolute right-2 top-2">
                    {this.state.showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={this.state.showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                  <button type="button" onClick={this.toggleConfirmPasswordVisibility} className="absolute right-2 top-2">
                    {this.state.showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Signup</button>
            </form>
          </div>
        )}
      </NavigationContext.Consumer>
    );
  }
}

export default withNavigation(Signup); 