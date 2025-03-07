import React from 'react';
import { Modal } from 'antd';

const CreateTicketModal = ({ 
  isVisible, 
  title, 
  description, 
  errors, 
  successMessage, 
  errorMessage, 
  handleChange, 
  handleSubmit, 
  handleCancel 
}) => {
  return (
    <Modal
      title="Create New Ticket"
      open={isVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <div className="mb-4">
        <label className="block mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
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
          onChange={handleChange}
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
  );
};

export default CreateTicketModal;