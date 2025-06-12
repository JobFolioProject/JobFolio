import React from 'react';
import '../../css/common/Pagination.css'; 

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className='pagination'>
      <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>{'<<'}</button>
      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>{'<'}</button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          className={num === currentPage ? 'active' : ''}
          onClick={() => setCurrentPage(num)}
        >
          {num}
        </button>
      ))}
      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>{'>'}</button>
      <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>{'>>'}</button>
    </div>
  );
};

export default Pagination;
