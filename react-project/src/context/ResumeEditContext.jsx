import React, { createContext, useState } from 'react';

export const ResumeEditContext = createContext();

export const ResumeEditProvider = ({ children }) => {
  // 이전: editResumeNo
  const [editResumePath, setEditResumePath] = useState(null);
  return (
    <ResumeEditContext.Provider value={{ editResumePath, setEditResumePath }}>
      {children}
    </ResumeEditContext.Provider>
  );
};