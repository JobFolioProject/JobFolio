// components/DateRangePicker.jsx
import React from 'react'; // useState 제거
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import './DateRangePicker.css'; // 필요 시 커스터마이징 CSS 작성
import '../../css/common/Calendar.css';

// selectedStartDate, selectedEndDate, onStartDateChange, onEndDateChange 프롭을 받도록 수정
export default function Calendar({ selectedStartDate, selectedEndDate, onChangeStartDate, onChangeEndDate,startplaceholder,endplaceholder}) {
  return (
    <div className="date-range-wrapper">
      <DatePicker
        selected={selectedStartDate}
        onChange={onChangeStartDate} // 변경 시 상위 컴포넌트의 핸들러 호출 //
        // // DatePicker의 onChange는 Calendar의 onChangeStartDate prop을 사용
        selectsStart
        startDate={selectedStartDate}
        endDate={selectedEndDate}
        dateFormat="yyyy-MM-dd"
        isClearable
        placeholderText={startplaceholder}
      />
      <span className="date-range-separator"></span>
      <DatePicker
        selected={selectedEndDate}
        onChange={onChangeEndDate} // 변경 시 상위 컴포넌트의 핸들러 호출
        selectsEnd
        startDate={selectedStartDate}
        endDate={selectedEndDate}
        minDate={selectedStartDate}
        dateFormat="yyyy-MM-dd"
        isClearable
        placeholderText={endplaceholder}
      />
    </div>
  );
}