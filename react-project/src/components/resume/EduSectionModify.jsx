import { useEffect } from "react";
import Calendar from "../common/Calendar";

const EduSectionModify = ({ resumeInfo, setResumeInfo }) => {
  const handleEducationDateChange = (index, field, date) => {
    setResumeInfo({
      ...resumeInfo,
      education: resumeInfo.education.map((item, idx) =>
        idx === index
          ? { ...item, [field]: date ? date.toISOString().slice(0, 10) : null }
          : item
      ),
    });
  };

  const eduStatusOptions = ["졸업", "재학", "수료", "휴학", "자퇴"];

  useEffect(() => {
    console.log(resumeInfo);
  }, []);
  return (
    <>
      <button
        className="addrBtn"
        onClick={() => {
          setResumeInfo({
            ...resumeInfo,
            education: [
              ...resumeInfo.education,
              {
                school_name: "",
                enroll_date: "",
                grad_date: "",
                edu_status: "",
                major: "",
                sub_major: "",
                gpa: "",
                notes: "",
              },
            ],
          });
        }}
      >
        {" "}
        학력사항 추가
      </button>
      {resumeInfo.education.map((edu, index) => (
        <div className="toggleInput" key={index}>
          <div>
            <label>
              학교명 <span className="required-mark">*</span>
            </label>
            <input
              type="text"
              value={edu.school_name}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index
                      ? { ...item, school_name: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </div>

          <div>
            <label>
              입학/졸업 <span className="required-mark">*</span>
            </label>
            <div className="edu_date_section">
              <Calendar
                selectedStartDate={
                  edu.enroll_date ? new Date(edu.enroll_date) : null
                }
                startplaceholder={"입학일"}
                onChangeStartDate={(date) =>
                  handleEducationDateChange(index, "enroll_date", date)
                }
                selectedEndDate={edu.isCurrentEdu ? "" : edu.grad_date}
                endplaceholder={"졸업일"}
                onChangeEndDate={(date) =>
                  handleEducationDateChange(index, "grad_date", date)
                }
                isCurrentEdu={edu.isCurrentEdu}
              />
            </div>
          </div>
          <div>
            <label>
              학력상태 <span className="required-mark">*</span>
            </label>
            <select
              name="status"
              value={edu.edu_status}
              onChange={(e) => {
                const value = e.target.value;
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index
                      ? {
                          ...item,
                          edu_status: e.target.value,
                          isCurrentEdu: value === "재학",
                          grad_date: value === "재학" ? "" : item.grad_date,
                        }
                      : item
                  ),
                });
              }}
            >
              {eduStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>
              전공 <span className="required-mark">*</span>
            </label>
            <input
              type="text"
              value={edu.major}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index ? { ...item, major: e.target.value } : item
                  ),
                });
              }}
            />
          </div>
          <div>
            <label>부전공</label>
            <input
              type="text"
              value={edu.sub_major}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index
                      ? { ...item, sub_major: e.target.value }
                      : item
                  ),
                });
              }}
            />
          </div>
          <div>
            <label>
              학점 <span className="required-mark">*</span>
            </label>
            <input
              type="text"
              value={edu.gpa}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
                    idx === index ? { ...item, gpa: e.target.value } : item
                  ),
                });
              }}
            />
          </div>
          <div>
            <label>특이사항</label>
            <input
              type="text"
              value={edu.notes}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  education: resumeInfo.education.map((item, idx) =>
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
                education: resumeInfo.education.filter(
                  (_, idx) => idx !== index
                ),
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
export default EduSectionModify;
