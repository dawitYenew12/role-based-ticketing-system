import React from 'react';
import { withNavigation } from '../../utils/withNavigation.jsx';

class Dashboard extends React.Component {
  render() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl">Welcome to the Dashboard!</h1>
      </div>
    );
  }
}

export default withNavigation(Dashboard); 