import React, { Component } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
import { withNavigation } from './withNavigation';
// import { useNavigation } from './NavigationContext';
import { NavigationContext } from './NavigationContext';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = async (e, navigate) => {
    e.preventDefault();
    const { email, password } = this.state;
    try {
      const response = await axios.post('http://localhost:3000/v1/auth/login', 
        { email, password },
        { withCredentials: true } 
      );
      const token = response.data.token.access.token;
      localStorage.setItem('access_token', token);
      const decodedToken = jwtDecode(token);
      
      if (response.status === 200 && response.data.success) {
        const role = decodedToken.role;
        if (role === 'admin201') {
          navigate('/adminDashboard');
        } else if (role === 'user202') {
          navigate('/userDashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      alert(errorMessage);
    }
  }

  render() {
    return (
      <NavigationContext.Consumer>
        {navigate => (
          <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={(e) => this.handleSubmit(e, navigate)} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
              <h2 className="text-2xl mb-4">Login</h2>
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input type="email" name="email" value={this.state.email} onChange={this.handleChange} className="w-full border border-gray-300 p-2 rounded" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="w-full border border-gray-300 p-2 rounded" required />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
            </form>
          </div>
        )}
      </NavigationContext.Consumer>
    );
  }
}

export default withNavigation(Login); 