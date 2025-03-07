import React from 'react';
import { Modal, Select } from 'antd';

const StatusModal = ({ 
  isVisible, 
  selectedStatus, 
  handleStatusChange, 
  handleStatusUpdate, 
  handleCancel 
}) => {
  return (
    <Modal
      title="Update Ticket Status"
      open={isVisible}
      onOk={handleStatusUpdate}
      onCancel={handleCancel}
    >
      <Select
        style={{ width: '100%' }}
        placeholder="Select new status"
        value={selectedStatus}
        onChange={handleStatusChange}
      >
        <Option value="OPEN">Open</Option>
        <Option value="IN_PROGRESS">In Progress</Option>
        <Option value="CLOSED">Closed</Option>
      </Select>
    </Modal>
  );
};

export default StatusModal;