import { useState } from "react";
import Calendar from "../common/Calendar";

const CareerSectionModify = ({ resumeInfo, setResumeInfo }) => {
  // const [isCurrentJob, setIsCurrentJob] = useState(false);
  const handleCareerDateChange = (index, field, date) => {
    setResumeInfo({
      ...resumeInfo,
      career: resumeInfo.career.map((item, idx) =>
        idx === index
          ? { ...item, [field]: date ? date.toISOString().slice(0, 10) : null }
          : item
      ),
    });
  };
  return (
    <>
      <button
        className="addrBtn"
        onClick={() => {
          if (resumeInfo.career.length >= 4) {
            alert("경력사항은 최대 4개까지 입력 가능합니다");
            return;
          }
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
                isCurrentJob: false,
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
          <div>
            <label>
              회사명 <span className="required-mark">*</span>
            </label>
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
          </div>

          <div>
            <label>
              입사/퇴사 <span className="required-mark">*</span>
            </label>
            <div className="career_date_section">
              <Calendar
                selectedStartDate={
                  career.start_date ? new Date(career.start_date) : null
                }
                startplaceholder={"입사일"}
                onChangeStartDate={(date) =>
                  handleCareerDateChange(index, "start_date", date)
                }
                selectedEndDate={career.isCurrentJob ? "" : career.end_date}
                endplaceholder={"퇴사일"}
                isCurrentJob={career.isCurrentJob}
                onChangeEndDate={(date) =>
                  handleCareerDateChange(index, "end_date", date)
                }
              ></Calendar>
              <span className="current-job-checkbox">
                <input
                  type="checkbox"
                  id="currentJob"
                  name=""
                  checked={career.isCurrentJob}
                  onChange={() => {
                    setResumeInfo({
                      ...resumeInfo,
                      career: resumeInfo.career.map((item, idx) =>
                        idx === index
                          ? {
                              ...item,
                              isCurrentJob: !item.isCurrentJob,
                              end_date: "",
                            }
                          : item
                      ),
                    });
                  }}
                />
                <p>재직중</p>
              </span>
            </div>
          </div>

          <div>
            <label>
              직무 <span className="required-mark">*</span>
            </label>
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
          </div>
          <div>
            <label>특이사항</label>
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
          </div>
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
