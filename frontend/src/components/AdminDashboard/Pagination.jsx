import React from 'react';
import { Button } from 'antd';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <div className="mt-4 flex justify-between items-center">
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;