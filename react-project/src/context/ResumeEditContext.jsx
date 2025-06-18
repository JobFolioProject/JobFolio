import React, { createContext, useState } from 'react';

export const ResumeEditContext = createContext();

export const ResumeEditProvider = ({ children }) => {
  // 이전: editResumeNo
  const [editResumeData, setEditResumeData] = useState({
    path: null,
    title: '',
    publication: ''
  });
  return (
    <ResumeEditContext.Provider value={{ editResumeData, setEditResumeData }}>
      {children}
    </ResumeEditContext.Provider>
  );
};