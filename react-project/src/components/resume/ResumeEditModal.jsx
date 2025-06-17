import { useEffect, useRef, useState } from "react";
import "../../css/resume/ResumeEditModal.css";
import PersonalInfoModify from "./PersonalInfoModify";
import RadioSelectorModify from "./RadioSelectorModify";
import CareerSectionModify from "./CareerSectionModify";
import EduSectionModify from "./EduSectionModify";
import SkillSectionModify from "./SkillSectionModify";
import LanguageSectionModify from "./LanguageSectionModify";
import CertSectionModify from "./CertSectionModify";
import axios from "../../utils/axiosConfig";
import Loading from "../common/Loading";
import { useAuth } from "../../context/AuthContext";

const ResumeEditModal = ({ open, onClose, resumeTitle, htmlString }) => {
  const [initHtmlcontent, setInitHtmlContent] = useState("");
  const { user, isAuthenticated } = useAuth();
  const [htmlContent, setHtmlContent] = useState("");
  const [initalResumeInfo, setInitialResumeInfo] = useState(null);
  const [aiComment, setAiComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeInfo, setResumeInfo] = useState({
    name: "",
    title: "",
    address: "",
    email: "",
    hp: "",
    desired_position: "",
    link: "",
    resumeNo: "",
    templateNo: "",
    coverLetter: "",
    publication_yn: "",
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
  });
  const [selectedRadio, setSelectedRadio] = useState("");
  const iframeRef = useRef(null);

  //html string prop전달한거 set
  useEffect(() => {
    setHtmlContent(htmlString);
    setInitHtmlContent(htmlString);
  }, [htmlString, resumeTitle]);

  // htmlContent에 있는 특정 class별로 변수 set
  useEffect(() => {
    if (!initalResumeInfo && htmlContent) {
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
      const schoolNameDiv = Array.from(
        doc.querySelectorAll(".school_name")
      ).map((el) => el.textContent.trim());
      const majorDiv = Array.from(doc.querySelectorAll(".major")).map((el) =>
        el.textContent.trim()
      );
      const eduStatusDiv = Array.from(doc.querySelectorAll(".edu_status")).map(
        (el) => el.textContent.trim()
      );
      const enrollDateDiv = Array.from(
        doc.querySelectorAll(".enroll_date")
      ).map((el) => el.textContent.trim());
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
      const acquiredDiv = Array.from(
        doc.querySelectorAll(".acquired_date")
      ).map((el) => el.textContent.trim());
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
      const coverLetterDiv = doc.querySelector(".coverLetter");

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

      const parsedResumeInfo = {
        title: resumeTitle,
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
      };

      setResumeInfo(parsedResumeInfo);
      setInitialResumeInfo(parsedResumeInfo);
    }
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

    //경력사항 전체 리스트
    const careerList = doc.querySelector(".section-content.career ul");

    //학력사항 정보
    const schoolNameDiv = doc.querySelectorAll(".school_name");
    const majorDiv = doc.querySelectorAll(".major");
    const eduStatusDiv = doc.querySelectorAll(".edu_status");
    const enrollDateDiv = doc.querySelectorAll(".enroll_date");
    const gradDateDiv = doc.querySelectorAll(".grad_date");
    const subMajorDiv = doc.querySelectorAll(".sub_major");
    const gpaDiv = doc.querySelectorAll(".gpa");
    const eduNotesDiv = doc.querySelectorAll(".notes");

    //학력사항 전체 리스트
    const eduList = doc.querySelector(".section-content.education ul");

    //기술스택 정보
    const skillCodeDiv = doc.querySelectorAll(".skill_code");
    const groupCodeDiv = doc.querySelectorAll(".group_code");
    const expLevelDiv = doc.querySelectorAll(".exp_level");
    const skillToolDiv = doc.querySelectorAll(".skill_tool");

    //기술사항 전체 리스트
    const skillList = doc.querySelector(".skills-list");

    //자격증정보
    const certNameDiv = doc.querySelectorAll(".certificate_name");
    const acquiredDiv = doc.querySelectorAll(".acquired_date");
    const certNoDiv = doc.querySelectorAll(".certificate_no");
    const certIssueDiv = doc.querySelectorAll(".issuing_org");
    const certNotesDiv = doc.querySelectorAll(".cert_notes");

    //자격증 전체 리스트
    const certList = doc.querySelector(".section-content.certification");

    //언어정보
    const langDiv = doc.querySelectorAll(".language");
    const levelDiv = doc.querySelectorAll(".level");

    //언어 전체 리스트
    const langList = doc.querySelector(".section-content.lang");

    //자기소개서 정보
    const coverLetterDiv = doc.querySelector(".coverLetter");

    // 사용자가 입력한 textarea값을 각각 class 값에 적용
    nameDiv.innerText = resumeInfo.name;
    posDiv.innerText = resumeInfo.desired_position;
    addressDiv.innerText = resumeInfo.address;
    emailDiv.innerText = resumeInfo.email;
    hpDiv.innerText = resumeInfo.hp;
    linkDiv.innerText = resumeInfo.link;
    coverLetterDiv.innerText = resumeInfo.coverLetter;

    //입력한 경력 사항 정보 iframe에 반영
    resumeInfo.career.forEach((career, index) => {
      if (companyNameDiv[index]) {
        companyNameDiv[index].innerText = career.company_name;
        careerStartDateDiv[index].innerText = career.start_date;
        careerEndDateDiv[index].innerText = career.end_date;
        careerPositionDateDiv[index].innerText = career.position;
        careerNotesDiv[index].innerText = career.notes;
      }
    });

    //경력사항 추가, 삭제시
    if (careerList) {
      careerList.innerHTML = "";

      resumeInfo.career.forEach((career) => {
        const li = doc.createElement("li");
        li.innerHTML = `
          <strong>
        <span class="company_name">${career.company_name}</span>
        (<span class="career_start_date">${career.start_date}</span>
        ~ <span class="career_end_date">${career.end_date}</span>)
      </strong><br />
      - <span class="position">${career.position}</span><br />
      - <span class="career_notes">${career.notes}</span>
        `;
        careerList.appendChild(li);
      });
    }

    //입력한 학력 사항 정보 iframe에 반영
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

    //학력사항 추가, 삭제시
    if (eduList) {
      eduList.innerHTML = "";

      resumeInfo.education.forEach((edu) => {
        const li = doc.createElement("li");
        li.innerHTML = `
         <strong
                ><span class="school_name">${edu.school_name}</span>
                <span class="major">${edu.major}</span></strong
              ><br />
              <span class="edu_status">${edu.edu_status}</span> (<span class="enroll_date"
                >${edu.enroll_date}</span
              >
              ~ <span class="grad_date">${edu.grad_date}</span>)<br />
              <span class="sub_major">${edu.sub_major}</span><br />
              <span class="gpa">${edu.gpa}</span><br />
              <span class="notes">${edu.notes}</span>
        `;
        eduList.appendChild(li);
      });
    }

    //입력한 기술스택 정보 iframe에 반영
    resumeInfo.skills.forEach((skill, index) => {
      if (skillCodeDiv[index]) {
        skillCodeDiv[index].innerText = skill.skill_code;
        groupCodeDiv[index].innerText = skill.group_code;
        expLevelDiv[index].innerText = skill.exp_level;
        skillToolDiv[index].innerText = skill.skill_tool;
      }
    });

    //기술 스택 추가/삭제 시
    if (skillList) {
      let htmlCode = "";
      resumeInfo.skills.forEach((skill) => {
        htmlCode += `
          <div class="skill-chip">
            <span class="group_code">${skill.group_code}</span>
            <span class="skill_code">${skill.skill_code}</span>
            <span class="exp_level">${skill.exp_level}</span>
            <span class="skill_tool">${skill.skill_tool}</span>
          </div>
        `;
      });
      skillList.innerHTML = htmlCode;
    }

    // 입력한 자격증 정보 iframe에 반영
    resumeInfo.certifications.forEach((cert, index) => {
      if (certNameDiv[index]) {
        certNameDiv[index].innerText = cert.certificate_name;
        certNoDiv[index].innerText = cert.certificate_no;
        certIssueDiv[index].innerText = cert.issuing_org;
        acquiredDiv[index].innerText = cert.acquired_date;
        certNotesDiv[index].innerText = cert.notes;
      }
    });

    if (certList) {
      let htmlCode = "";
      resumeInfo.certifications.forEach((cert) => {
        htmlCode += `
          -<span class="certificate_name">${cert.certificate_name}</span> (<span
            class="acquired_date"
            >${cert.acquired_date}</span

          >)
          <span class="certificate_no">${cert.certificate_no}</span>
          <span class="issuing_org">${cert.issuing_org}</span>
          <span class="cert_notes">${cert.notes}</span><br/>
        `;
      });
      certList.innerHTML = htmlCode;
    }

    // 입력한 외국어 역량 정보 iframe에 반영
    resumeInfo.languages.forEach((lang, index) => {
      if (langDiv[index]) {
        langDiv[index].innerText = lang.language;
        levelDiv[index].innerText = lang.level;
      }
    });

    // 외국어 역량 추가, 삭제시
    if (langList) {
      let htmlCode = "";
      resumeInfo.languages.forEach((lang) => {
        htmlCode += `
          - <span class="language">${lang.language}</span> <span class="level">${lang.level}</span>
          <br />
        `;
      });
      langList.innerHTML = htmlCode;
    }
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

  // radio 버튼 클릭 이벤트
  const toggleRadio = (event) => {
    setSelectedRadio(event.target.id);
  };

  const publicationToggle = (event) => {
    setResumeInfo((prev) => ({
      ...prev,
      publication_yn: event.target.value,
    }));
  };

  // 이력서 수정 버튼 클릭 이벤트
  const saveModify = async () => {
    const updatedHtml = getPreviewHtml();
    await axios
      .post("/api/resume/saveModifiedResume", {
        userNo: user.userNo,
        resumeInfo: resumeInfo,
        templateNo: 2,
        html: updatedHtml,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClose = () => {
    //모달창 닫을 시 기본값 초기화
    if (initalResumeInfo && initHtmlcontent) {
      setHtmlContent(initHtmlcontent);
      setResumeInfo(initalResumeInfo);
    }
    setSelectedRadio("");
    setAiComment("");
    onClose();
  };

  const getAiComment = async () => {
    setLoading(true);
    await axios
      .post("/api/resume/getAiComment", { resumeInfo: resumeInfo })
      .then((res) => {
        const parsedAnswer = JSON.parse(res.response);
        setAiComment(parsedAnswer.choices[0].message.content);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
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
        <PersonalInfoModify
          resumeInfo={resumeInfo}
          setResumeInfo={setResumeInfo}
        ></PersonalInfoModify>
        <RadioSelectorModify toggleRadio={toggleRadio}></RadioSelectorModify>

        {/*링크 클릭시 */}
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

        {/*경력 클릭시 */}
        {selectedRadio === "career" && (
          <CareerSectionModify
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
          ></CareerSectionModify>
        )}
        {/*학력 클릭시 */}
        {selectedRadio === "edu" && (
          <EduSectionModify
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
          ></EduSectionModify>
        )}
        {/*기술스택 클릭시 */}
        {selectedRadio === "skill" && (
          <SkillSectionModify
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
          ></SkillSectionModify>
        )}
        {/*외국어 역량 클릭시 */}
        {selectedRadio === "language" && (
          <LanguageSectionModify
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
          ></LanguageSectionModify>
        )}
        {/*자격증 클릭시 */}
        {selectedRadio === "certification" && (
          <CertSectionModify
            resumeInfo={resumeInfo}
            setResumeInfo={setResumeInfo}
          ></CertSectionModify>
        )}

        {/*자기소개서 클릭시 */}
        {selectedRadio === "cover_letter" && (
          <div className="toggleInput">
            <textarea
              className="coverLetterTextarea"
              rows={4}
              value={resumeInfo.coverLetter}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  coverLetter: e.target.value,
                });
              }}
            />
          </div>
        )}

        <div className="aiSection">
          <h2 className="aiTitle">AI Comment</h2>
          <textarea
            className="aiInput"
            rows={4}
            readOnly
            placeholder="AI 코멘트를 확인하세요"
            value={aiComment ? aiComment : ""}
          />
        </div>
        <div className="buttonRow">
          <button className="secondaryBtn" onClick={getAiComment}>
            AI comment
          </button>
        </div>

        <div>
          <input
            type="radio"
            name="publication_yn"
            id="public"
            value="Y"
            onChange={publicationToggle}
            checked
          />
          <label htmlFor="public">공개</label>

          <input
            type="radio"
            name="publication_yn"
            id="private"
            value="N"
            onChange={publicationToggle}
          />
          <label htmlFor="edprivateu">비공개</label>
        </div>

        <div className="buttonRow">
          <button className="secondaryBtn" onClick={saveModify}>
            수정 사항 저장
          </button>
          <button className="modal-close secondaryBtn" onClick={handleClose}>
            닫기
          </button>
        </div>
      </div>
      <Loading loading={loading}></Loading>
    </div>
  );
};

export default ResumeEditModal;
