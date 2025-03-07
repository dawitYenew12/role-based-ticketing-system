import React, { Component } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { withNavigation } from '../../../utils/withNavigation.jsx';
import { NavigationContext } from '../../../context/NavigationContext.jsx';
import { validatePassword } from '../../../utils/validation.jsx';
import { message } from 'antd';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {
        email: '',
        password: ''
      },
      loginError: ''
    };
  }

  validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    let fieldError = '';
    
    if (name === 'email') {
      fieldError = this.validateEmail(value);
    } else if (name === 'password') {
      if (value && value.length > 0) {
        const { isValid, errors } = validatePassword(value);
        if (!isValid) {
          fieldError = errors.join('. ');
        }
      }
    }
    
    this.setState({ 
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: fieldError
      },
      loginError: ''
    });
  };

  handleSubmit = async (e, navigate) => {
    e.preventDefault();
    const { email, password } = this.state;
    
    const emailError = this.validateEmail(email);
    
    let passwordError = '';
    if (!password) {
      passwordError = 'Password is required';
    }
    
    if (emailError || passwordError) {
      this.setState({
        errors: {
          email: emailError,
          password: passwordError
        }
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/v1/auth/login', 
        { email, password },
        { withCredentials: true } 
      );
      const token = response.data.token.access.token;
      localStorage.setItem('access_token', token);
      const decodedToken = jwtDecode(token);
      
      if (response.status === 200 && response.data.success) {
        message.success('Login successful!');
        const role = decodedToken.role;
        if (role === 'admin201') {
          navigate('/adminDashboard');
        } else if (role === 'user202') {
          navigate('/userDashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid email or password. Please try again.';
      
      this.setState({ loginError: errorMessage });
      message.error(errorMessage);
    }
  }

  render() {
    const { email, password, errors, loginError } = this.state;
    
    return (
      <NavigationContext.Consumer>
        {navigate => (
          <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={(e) => this.handleSubmit(e, navigate)} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
              <h2 className="text-2xl mb-4">Login</h2>
              
              {loginError && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {loginError}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={email} 
                  onChange={this.handleChange} 
                  className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
                  required 
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={password} 
                  onChange={this.handleChange} 
                  className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-2 rounded`}
                  required 
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                disabled={!!errors.email || !!errors.password}
              >
                Login
              </button>
            </form>
          </div>
        )}
      </NavigationContext.Consumer>
    );
  }
}

export default withNavigation(Login); 