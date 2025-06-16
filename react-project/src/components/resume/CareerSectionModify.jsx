import Calendar from "../common/Calendar";

const CareerSectionModify = ({ resumeInfo, setResumeInfo }) => {
  const handleCareerDateChange = (index, field, date) => {
    setResumeInfo({
      ...resumeInfo,
      career: resumeInfo.career.map((item, idx) =>
        idx === index
          ? { ...item, [field]: date.toISOString().slice(0, 10) }
          : item
      ),
    });
  };
  return (
    <>
      <button
        className="addrBtn"
        onClick={() => {
          setResumeInfo({
            ...resumeInfo,
            career: [
              ...resumeInfo.career,
              {
                company_name: "",
                start_date: "",
                end_date: "",
                position: "",
                notes: "",
              },
            ],
          });
        }}
      >
        {" "}
        경력사항 추가
      </button>
      {resumeInfo.career.map((career, index) => (
        <div className="toggleInput" key={index}>
          <label>
            <div>회사명</div>
            <input
              type="text"
              value={career.company_name}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  career: resumeInfo.career.map((item, idx) =>
                    idx === index
                      ? { ...item, company_name: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </label>

          <label>
            <div>입사/퇴사 날짜</div>
            <Calendar
              selectedStartDate={
                career.start_date ? new Date(career.start_date) : null
              }
              startplaceholder={"입사일"}
              onChangeStartDate={(date) =>
                handleCareerDateChange(index, "start_date", date)
              }
              selectedEndDate={
                career.end_date ? new Date(career.end_date) : null
              }
              endplaceholder={"퇴사일"}
              onChangeEndDate={(date) =>
                handleCareerDateChange(index, "end_date", date)
              }
            ></Calendar>
          </label>

          <label>
            <div>직무</div>
            <input
              type="text"
              value={career.position}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  career: resumeInfo.career.map((item, idx) =>
                    idx === index ? { ...item, position: e.target.value } : item
                  ),
                });
              }}
            />
          </label>
          <label>
            <div>특이사항</div>
            <input
              type="text"
              value={career.notes}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  career: resumeInfo.career.map((item, idx) =>
                    idx === index ? { ...item, notes: e.target.value } : item
                  ),
                });
              }}
            />
          </label>
          <button
            className="deleteCareerBtn"
            onClick={() => {
              setResumeInfo({
                ...resumeInfo,
                career: resumeInfo.career.filter((_, idx) => idx !== index),
              });
            }}
          >
            삭제
          </button>
        </div>
      ))}
    </>
  );
};

export default CareerSectionModify;
