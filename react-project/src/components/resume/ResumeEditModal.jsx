import { useEffect, useRef, useState } from "react";
import "../../css/resume/ResumeEditModal.css";

const ResumeEditModal = ({ open, onClose, props }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [resumeInfo, setResumeInfo] = useState({
    name: "",
    address: "",
    email: "",
    hp: "",
    desired_position: "",
    link: "",
    education: [
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
    career: [
      {
        company_name: "",
        start_date: "",
        end_date: "",
        position: "",
        notes: "",
      },
    ],
    skills: [
      {
        skill_code: "",
        group_code: "",
        exp_level: "",
        skill_tool: "",
      },
    ],
    languages: [
      {
        language: "",
        level: "",
      },
    ],
    certifications: [
      {
        certificate_no: "",
        certificate_name: "",
        issuing_org: "",
        acquired_date: "",
        notes: "",
      },
    ],
    coverLetter: "",
  });
  const [selectedRadio, setSelectedRadio] = useState("");
  const [fixedPath, setFixedPath] = useState(props.fixedPath);
  const iframeRef = useRef(null);

  //html 파일 호출 후 text로 변수에 저장
  useEffect(() => {
    fetch(fixedPath + "example.html")
      .then((res) => res.text())
      .then((html) => setHtmlContent(html));
  }, []);

  // htmlContent에 있는 특정 class별로 변수 set
  useEffect(() => {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const nameDiv = doc.querySelector(".userName");
    const posDiv = doc.querySelector(".desired_position");
    const addressDiv = doc.querySelector(".address");
    const emailDiv = doc.querySelector(".email");
    const hpDiv = doc.querySelector(".hp");
    const linkDiv = doc.querySelector(".link");

    //경력사항 정보
    const companyNameDiv = Array.from(
      doc.querySelectorAll(".company_name")
    ).map((el) => el.textContent.trim());
    const careerStartDateDiv = Array.from(
      doc.querySelectorAll(".career_start_date")
    ).map((el) => el.textContent.trim());
    const careerEndDateDiv = Array.from(
      doc.querySelectorAll(".career_end_date")
    ).map((el) => el.textContent.trim());
    const careerPositionDateDiv = Array.from(
      doc.querySelectorAll(".position")
    ).map((el) => el.textContent.trim());
    const careerNotesDiv = Array.from(
      doc.querySelectorAll(".career_notes")
    ).map((el) => el.textContent.trim());

    //학력사항 정보
    const schoolNameDiv = Array.from(doc.querySelectorAll(".school_name")).map(
      (el) => el.textContent.trim()
    );
    const majorDiv = Array.from(doc.querySelectorAll(".major")).map((el) =>
      el.textContent.trim()
    );
    const eduStatusDiv = Array.from(doc.querySelectorAll(".edu_status")).map(
      (el) => el.textContent.trim()
    );
    const enrollDateDiv = Array.from(doc.querySelectorAll(".enroll_date")).map(
      (el) => el.textContent.trim()
    );
    const gradDateDiv = Array.from(doc.querySelectorAll(".grad_date")).map(
      (el) => el.textContent.trim()
    );
    const subMajorDiv = Array.from(doc.querySelectorAll(".sub_major")).map(
      (el) => el.textContent.trim()
    );
    const gpaDiv = Array.from(doc.querySelectorAll(".gpa")).map((el) =>
      el.textContent.trim()
    );
    const eduNotesDiv = Array.from(doc.querySelectorAll(".notes")).map((el) =>
      el.textContent.trim()
    );

    //기술스택 정보
    const skillCodeDiv = Array.from(doc.querySelectorAll(".skill_code")).map(
      (el) => el.textContent.trim()
    );
    const groupCodeDiv = Array.from(doc.querySelectorAll(".group_code")).map(
      (el) => el.textContent.trim()
    );
    const expLevelDiv = Array.from(doc.querySelectorAll(".exp_level")).map(
      (el) => el.textContent.trim()
    );
    const skillToolDiv = Array.from(doc.querySelectorAll(".skill_tool")).map(
      (el) => el.textContent.trim()
    );

    //자격증정보
    const certNameDiv = Array.from(
      doc.querySelectorAll(".certificate_name")
    ).map((el) => el.textContent.trim());
    const acquiredDiv = Array.from(doc.querySelectorAll(".acquired_date")).map(
      (el) => el.textContent.trim()
    );
    const certNoDiv = Array.from(doc.querySelectorAll(".certificate_no")).map(
      (el) => el.textContent.trim()
    );
    const certIssueDiv = Array.from(doc.querySelectorAll(".issuing_org")).map(
      (el) => el.textContent.trim()
    );
    const certNotesDiv = Array.from(doc.querySelectorAll(".cert_notes")).map(
      (el) => el.textContent.trim()
    );

    //언어정보
    const langDiv = Array.from(doc.querySelectorAll(".language")).map((el) =>
      el.textContent.trim()
    );
    const levelDiv = Array.from(doc.querySelectorAll(".level")).map((el) =>
      el.textContent.trim()
    );

    //자기소개서 정보
    const coverLetterDiv = Array.from(doc.querySelectorAll(".coverLetter")).map(
      (el) => el.textContent.trim()
    );

    const careers = companyNameDiv.map((name, index) => ({
      company_name: name,
      start_date: careerStartDateDiv[index] || "",
      end_date: careerEndDateDiv[index] || "",
      position: careerPositionDateDiv[index] || "",
      notes: careerNotesDiv[index] || "",
    }));

    const educations = schoolNameDiv.map((name, index) => ({
      school_name: name,
      major: majorDiv[index] || "",
      edu_status: eduStatusDiv[index] || "",
      enroll_date: enrollDateDiv[index] || "",
      grad_date: gradDateDiv[index] || "",
      sub_major: subMajorDiv[index] || "",
      gpa: gpaDiv[index] || "",
      notes: eduNotesDiv[index] || "",
    }));

    const skillList = skillCodeDiv.map((code, index) => ({
      skill_code: code,
      group_code: groupCodeDiv[index] || "",
      exp_level: expLevelDiv[index] || "",
      skill_tool: skillToolDiv[index] || "",
    }));

    const certificationList = certNameDiv.map((cert, index) => ({
      certificate_name: cert,
      certificate_no: certNoDiv[index] || "",
      issuing_org: certIssueDiv[index] || "",
      acquired_date: acquiredDiv[index] || "",
      notes: certNotesDiv[index] || "",
    }));

    const languageList = langDiv.map((lang, index) => ({
      language: lang || "",
      level: levelDiv[index] || "",
    }));

    setResumeInfo((prev) => ({
      ...prev,
      name: nameDiv ? nameDiv.innerText : "",
      desired_position: posDiv ? posDiv.innerText : "",
      address: addressDiv ? addressDiv.innerText : "",
      email: emailDiv ? emailDiv.innerText : "",
      hp: hpDiv ? hpDiv.innerText : "",
      link: linkDiv ? linkDiv.innerText : "",
      career: careers,
      education: educations,
      skills: skillList,
      certifications: certificationList,
      languages: languageList,
      coverLetter: coverLetterDiv ? coverLetterDiv.innerText : "",
    }));
  }, [htmlContent]);

  // 수정할때마다 실시간으로 iframe에 변경된 사항 적용
  const getPreviewHtml = () => {
    if (!htmlContent) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const nameDiv = doc.querySelector(".userName");
    const posDiv = doc.querySelector(".desired_position");
    const addressDiv = doc.querySelector(".address");
    const emailDiv = doc.querySelector(".email");
    const hpDiv = doc.querySelector(".hp");
    const linkDiv = doc.querySelector(".link");

    //경력사항 정보
    const companyNameDiv = doc.querySelectorAll(".company_name");
    const careerStartDateDiv = doc.querySelectorAll(".career_start_date");
    const careerEndDateDiv = doc.querySelectorAll(".career_end_date");
    const careerPositionDateDiv = doc.querySelectorAll(".position");
    const careerNotesDiv = doc.querySelectorAll(".career_notes");

    //학력사항 정보
    const schoolNameDiv = doc.querySelectorAll(".school_name");
    const majorDiv = doc.querySelectorAll(".major");
    const eduStatusDiv = doc.querySelectorAll(".edu_status");
    const enrollDateDiv = doc.querySelectorAll(".enroll_date");
    const gradDateDiv = doc.querySelectorAll(".grad_date");
    const subMajorDiv = doc.querySelectorAll(".sub_major");
    const gpaDiv = doc.querySelectorAll(".gpa");
    const eduNotesDiv = doc.querySelectorAll(".notes");

    //기술스택 정보
    const skillCodeDiv = doc.querySelectorAll(".skill_code");
    const groupCodeDiv = doc.querySelectorAll(".group_code");
    const expLevelDiv = doc.querySelectorAll(".exp_level");
    const skillToolDiv = doc.querySelectorAll(".skill_tool");

    //자격증정보
    const certNameDiv = doc.querySelectorAll(".certificate_name");
    const acquiredDiv = doc.querySelectorAll(".acquired_date");
    const certNoDiv = doc.querySelectorAll(".certificate_no");
    const certIssueDiv = doc.querySelectorAll(".issuing_org");
    const certNotesDiv = doc.querySelectorAll(".cert_notes");

    //언어정보
    const langDiv = doc.querySelectorAll(".language");
    const levelDiv = doc.querySelectorAll(".level");

    //자기소개서 정보
    const coverLetterDiv = doc.querySelectorAll(".coverLetter");

    //사용자가 입력한 textarea값을 각각 class 값에 적용

    nameDiv.innerText = resumeInfo.name;
    posDiv.innerText = resumeInfo.desired_position;
    addressDiv.innerText = resumeInfo.address;
    emailDiv.innerText = resumeInfo.email;
    hpDiv.innerText = resumeInfo.hp;
    linkDiv.innerText = resumeInfo.link;
    coverLetterDiv.innerText = resumeInfo.coverLetter;

    resumeInfo.career.forEach((career, index) => {
      if (companyNameDiv[index]) {
        companyNameDiv[index].innerText = career.company_name;
        careerStartDateDiv[index].innerText = career.start_date;
        careerEndDateDiv[index].innerText = career.end_date;
        careerPositionDateDiv[index].innerText = career.position;
        careerNotesDiv[index].innerText = career.notes;
      }
    });

    resumeInfo.education.forEach((education, index) => {
      if (schoolNameDiv[index]) {
        schoolNameDiv[index].innerText = education.school_name;
        enrollDateDiv[index].innerText = education.enroll_date;
        gradDateDiv[index].innerText = education.grad_date;
        eduStatusDiv[index].innerText = education.edu_status;
        majorDiv[index].innerText = education.major;
        subMajorDiv[index].innerText = education.sub_major;
        gpaDiv[index].innerText = education.gpa;
        eduNotesDiv[index].innerText = education.notes;
      }
    });

    resumeInfo.skills.forEach((skill, index) => {
      if (skillCodeDiv[index]) {
        skillCodeDiv[index].innerText = skill.skill_code;
        groupCodeDiv[index].innerText = skill.group_code;
        expLevelDiv[index].innerText = skill.exp_level;
        skillToolDiv[index].innerText = skill.skill_tool;
      }
    });

    resumeInfo.certifications.forEach((cert, index) => {
      if (certNameDiv[index]) {
        certNameDiv[index].innerText = cert.certificate_name;
        certNoDiv[index].innerText = cert.certificate_no;
        certIssueDiv[index].innerText = cert.issuing_org;
        acquiredDiv[index].innerText = cert.acquired_date;
        certNotesDiv[index].innerText = cert.notes;
      }
    });

    resumeInfo.languages.forEach((lang, index) => {
      if (langDiv[index]) {
        langDiv[index].innerText = lang.language;
        langDiv[index].innerText = lang.level;
      }
    });

    return doc.documentElement.outerHTML;
  };

  //iframe html적용에 따른 크기 변경
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resizeIframe = () => {
      try {
        if (
          iframe.contentWindow &&
          iframe.contentWindow.document &&
          iframe.contentWindow.document.body
        ) {
          const contentHeight = iframe.contentWindow.document.body.scrollHeight;
          iframe.style.height = contentHeight + "px";
        }
      } catch (e) {}
    };
    iframe.addEventListener("load", resizeIframe);
    return () => {
      iframe.removeEventListener("load", resizeIframe);
    };
  }, [resumeInfo, htmlContent]);

  const toggleRadio = (event) => {
    setSelectedRadio(event.target.id);
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <iframe
          className="htmlContent"
          ref={iframeRef}
          srcDoc={getPreviewHtml()}
        ></iframe>
        <label>
          <div>
            <span>이름</span>
          </div>
          <div>
            <input
              type="text"
              name="name"
              value={resumeInfo.name}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  name: e.target.value,
                });
              }}
            />
          </div>
        </label>
        <label>
          <div>
            <span>희망직무</span>
          </div>
          <div>
            <input
              type="text"
              name="position"
              value={resumeInfo.desired_position}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  desired_position: e.target.value,
                });
              }}
            />
          </div>
        </label>
        <label>
          <div>
            <span>주소</span>
          </div>
          <div>
            <input
              type="text"
              name="address"
              value={resumeInfo.address}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  address: e.target.value,
                });
              }}
            />
          </div>
        </label>
        <label>
          <div>
            <span>이메일</span>
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={resumeInfo.email}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  email: e.target.value,
                });
              }}
            />
          </div>
        </label>
        <label>
          <div>
            <span>전화번호</span>
          </div>
          <div>
            <input
              type="text"
              name="phoneNum"
              value={resumeInfo.hp}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  hp: e.target.value,
                });
              }}
            />
          </div>
        </label>

        <label>
          <div>
            <span>변경 필드 선택</span>
          </div>
          <div className="checkbox_list">
            <input type="radio" name="list" id="link" onChange={toggleRadio} />
            <label htmlFor="link">링크</label>

            <input type="radio" name="list" id="edu" onChange={toggleRadio} />
            <label htmlFor="edu">학력</label>
            <input
              type="radio"
              name="list"
              id="career"
              onChange={toggleRadio}
            />
            <label htmlFor="career">경력</label>
            <input type="radio" name="list" id="skill" onChange={toggleRadio} />
            <label htmlFor="skill">기술스택</label>
            <input
              type="radio"
              name="list"
              id="language"
              onChange={toggleRadio}
            />
            <label htmlFor="language">외국어 역량</label>
            <input
              type="radio"
              name="list"
              id="certification"
              onChange={toggleRadio}
            />
            <label htmlFor="certification">자격증</label>
            <input
              type="radio"
              name="list"
              id="cover_letter"
              onChange={toggleRadio}
            />
            <label htmlFor="cover_letter">자기소개서</label>
          </div>
        </label>

        {selectedRadio === "link" && (
          <div className="toggleInput">
            <input
              type="text"
              placeholder="링크를 입력하세요"
              value={resumeInfo.link}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  link: e.target.value,
                });
              }}
            />
          </div>
        )}
        {selectedRadio === "career" && (
          <>
            <button className="addCareerBtn">이력사항 추가</button>
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
                  <div>입사일</div>
                  <input
                    type="text"
                    value={career.start_date}
                    onChange={(e) => {
                      setResumeInfo({
                        ...resumeInfo,
                        career: resumeInfo.career.map((item, idx) =>
                          idx === index
                            ? { ...item, start_date: e.target.value }
                            : item
                        ),
                      });
                    }}
                  />
                </label>
                <label>
                  <div>퇴사일</div>
                  <input
                    type="text"
                    value={career.end_date}
                    onChange={(e) => {
                      setResumeInfo({
                        ...resumeInfo,
                        career: resumeInfo.career.map((item, idx) =>
                          idx === index
                            ? { ...item, end_date: e.target.value }
                            : item
                        ),
                      });
                    }}
                  />
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
                          idx === index
                            ? { ...item, position: e.target.value }
                            : item
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
                          idx === index
                            ? { ...item, notes: e.target.value }
                            : item
                        ),
                      });
                    }}
                  />
                </label>
                <button className="deleteCareerBtn">삭제</button>
              </div>
            ))}
          </>
        )}

        <div className="buttonRow">
          <button className="secondaryBtn">수정 사항 저장</button>
          <button className="modal-close secondaryBtn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditModal;
