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
import TemplateSelection from "./TemplateSelection";

const ResumeEditModal = ({
  open,
  onClose,
  resumeTitle,
  htmlString,
  publication,
  templateNo,
}) => {
  const [initHtmlcontent, setInitHtmlContent] = useState("");
  const { user, isAuthenticated } = useAuth();
  const [resumeFilePath, setResumeFilePath] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [initalResumeInfo, setInitialResumeInfo] = useState(null);
  const [aiComment, setAiComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [download, setIsDownload] = useState(false);
  const [resumeInfo, setResumeInfo] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
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
        isCurrentEdu: false,
      },
    ],
    career: [
      {
        company_name: "",
        start_date: "",
        end_date: "",
        position: "",
        notes: "",
        isCurrentJob: false,
      },
    ],
    skills: [
      {
        skill_code: "",
        group_code: "",
        exp_level: "",
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
      const emailDiv = doc.querySelector(".email");
      const phoneDiv = doc.querySelector(".phone");
      const linkDiv = doc.querySelector(".link");

      //학력사항 정보
      const eduRows = doc.querySelectorAll("table.education tbody tr");
      const eduList = Array.from(eduRows).map((tr) => ({
        school_name: tr.querySelector(".school_name")?.textContent.trim() || "",
        enroll_date: tr.querySelector(".enroll_date")?.textContent.trim() || "",
        grad_date: tr.querySelector(".grad_date")?.textContent.trim() || "",
        edu_status: tr.querySelector(".edu_status")?.textContent.trim() || "",
        major: tr.querySelector(".major")?.textContent.trim() || "",
        sub_major: tr.querySelector(".sub_major")?.textContent.trim() || "",
        gpa: tr.querySelector(".gpa")?.textContent.trim() || "",
        notes: tr.querySelector(".notes")?.textContent.trim() || "",
        isCurrentEdu:
          tr.querySelector(".edu_status").textContent.trim() === "재학"
            ? true
            : false,
      }));

      //경력사항 정보
      const careerRows = doc.querySelectorAll("table.experience tbody tr");
      const careerList = Array.from(careerRows).map((tr) => ({
        company_name:
          tr.querySelector(".company_name")?.textContent.trim() || "",
        start_date: tr.querySelector(".start_date")?.textContent.trim() || "",
        end_date: tr.querySelector(".end_date")?.textContent.trim() || "",
        position: tr.querySelector(".position")?.textContent.trim() || "",
        notes: tr.querySelector(".notes")?.textContent.trim() || "",
        isCurrentJob:
          tr.querySelector(".end_date").textContent.trim() === ""
            ? true
            : false,
      }));

      //스킬사항 정보
      const skillRows = doc.querySelectorAll("table.skillList tbody tr");
      const skillList = Array.from(skillRows).map((tr) => ({
        skill_code: tr.querySelector(".skill_code")?.textContent.trim() || "",
        group_code: tr.querySelector(".group_code")?.textContent.trim() || "",
        exp_level: tr.querySelector(".exp_level")?.textContent.trim() || "",
      }));

      //자격증 정보
      const certRows = doc.querySelectorAll("table.certification tbody tr");
      const certList = Array.from(certRows).map((tr) => ({
        certificate_no:
          tr.querySelector(".certificate_no")?.textContent.trim() || "",
        certificate_name:
          tr.querySelector(".certificate_name")?.textContent.trim() || "",
        issuing_org: tr.querySelector(".issuing_org")?.textContent.trim() || "",
        acquired_date:
          tr.querySelector(".acquired_date")?.textContent.trim() || "",
      }));

      //언어 정보
      const langRows = doc.querySelectorAll("table.language_skill tbody tr");
      const langList = Array.from(langRows).map((tr) => ({
        language: tr.querySelector(".language")?.textContent.trim() || "",
        level: tr.querySelector(".level")?.textContent.trim() || "",
      }));

      //자기소개서 정보
      const coverLetterDiv = doc.querySelector(".introduction");

      const parsedResumeInfo = {
        title: resumeTitle,
        name: nameDiv ? nameDiv.innerText : "",
        email: emailDiv ? emailDiv.innerText : "",
        phone: phoneDiv ? phoneDiv.innerText : "",
        link: linkDiv ? linkDiv.innerText : "",
        career: careerList,
        education: eduList,
        skills: skillList,
        certifications: certList,
        languages: langList,
        coverLetter: coverLetterDiv ? coverLetterDiv.innerText : "",
        publication_yn: publication,
        templateNo: templateNo,
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
    const emailDiv = doc.querySelector(".email");
    const phoneDiv = doc.querySelector(".phone");
    const linkDiv = doc.querySelector(".link");

    //경력사항 정보
    const companyNameDiv = doc.querySelectorAll(".company_name");
    const careerStartDateDiv = doc.querySelectorAll(".start_date");
    const careerEndDateDiv = doc.querySelectorAll(".end_date");
    const careerPositionDateDiv = doc.querySelectorAll(".position");
    const careerNotesDiv = doc.querySelectorAll(".career_notes");

    //경력사항 전체 리스트
    const careerList = doc.querySelector("table.experience tbody");

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
    const eduList = doc.querySelector("table.education tbody");

    //기술스택 정보
    const skillCodeDiv = doc.querySelectorAll(".skill_code");
    const groupCodeDiv = doc.querySelectorAll(".group_code");
    const expLevelDiv = doc.querySelectorAll(".exp_level");

    //기술사항 전체 리스트
    const skillList = doc.querySelector("table.skillList tbody");

    //자격증정보
    const certNameDiv = doc.querySelectorAll(".certificate_name");
    const acquiredDiv = doc.querySelectorAll(".acquired_date");
    const certNoDiv = doc.querySelectorAll(".certificate_no");
    const certIssueDiv = doc.querySelectorAll(".issuing_org");

    //자격증 전체 리스트
    const certList = doc.querySelector("table.certification tbody");

    //언어정보
    const langDiv = doc.querySelectorAll(".language");
    const levelDiv = doc.querySelectorAll(".level");

    //언어 전체 리스트
    const langList = doc.querySelector("table.language_skill tbody");

    //자기소개서 정보
    const coverLetterDiv = doc.querySelector(".introduction");

    // 사용자가 입력한 textarea값을 각각 class 값에 적용
    nameDiv.innerText = resumeInfo.name;
    emailDiv.innerText = resumeInfo.email;
    phoneDiv.innerText = resumeInfo.phone;
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
        const tr = doc.createElement("tr");
        tr.innerHTML = `
          <td>
                  <span class="start_date">${career.start_date}</span> ~
                  <span class="end_date">${career.end_date}</span>
                </td>
                <td class="company_name">${career.company_name}</td>
                <td class="position">${career.position}</td>
                <td class="career_notes">${career.notes}</td>
        `;
        careerList.appendChild(tr);
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
        const tr = doc.createElement("tr");
        tr.innerHTML = `
         <td class="school_name">${edu.school_name}</td>
                <td>
                  <span class="enroll_date">${edu.enroll_date}</span> -
                  <span class="grad_date">${edu.grad_date}</span>
                </td>
                <td class="edu_status">${edu.edu_status}</td>
                <td class="major">${edu.major}</td>
                <td class="sub_major">${edu.sub_major}</td>
                <td class="gpa">${edu.gpa}</td>
                <td class="notes">${edu.notes}</td>
        `;
        eduList.appendChild(tr);
      });
    }

    //입력한 기술스택 정보 iframe에 반영
    resumeInfo.skills.forEach((skill, index) => {
      if (skillCodeDiv[index]) {
        skillCodeDiv[index].innerText = skill.skill_code;
        groupCodeDiv[index].innerText = skill.group_code;
        expLevelDiv[index].innerText = skill.exp_level;
      }
    });

    //기술 스택 추가/삭제 시
    if (skillList) {
      skillList.innerHTML = "";

      resumeInfo.skills.forEach((skill) => {
        const tr = doc.createElement("tr");
        tr.innerHTML = `
         <td class="group_code">${skill.group_code}</td>
                <td class="skill_code">${skill.skill_code}</td>
                <td class="exp_level">${skill.exp_level}</td>
        `;
        skillList.appendChild(tr);
      });
    }

    // 입력한 자격증 정보 iframe에 반영
    resumeInfo.certifications.forEach((cert, index) => {
      if (certNameDiv[index]) {
        certNameDiv[index].innerText = cert.certificate_name;
        certNoDiv[index].innerText = cert.certificate_no;
        certIssueDiv[index].innerText = cert.issuing_org;
        acquiredDiv[index].innerText = cert.acquired_date;
      }
    });

    if (certList) {
      certList.innerHTML = "";

      resumeInfo.certifications.forEach((cert) => {
        const tr = doc.createElement("tr");
        tr.innerHTML = `
         <td class="certificate_no">${cert.certificate_no}</td>
                <td class="certificate_name">${cert.certificate_name}</td>
                <td class="issuing_org">${cert.issuing_org}</td>
                <td class="acquired_date">${cert.acquired_date}</td>
        `;
        certList.appendChild(tr);
      });
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
      langList.innerHTML = "";

      resumeInfo.languages.forEach((lang) => {
        const tr = doc.createElement("tr");
        tr.innerHTML = `
         <tr>
                <td class="language">${lang.language}</td>
                <td class="level">${lang.level}</td>
              </tr>
        `;
        langList.appendChild(tr);
      });
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
    if (!validateProfile()) return;
    if (!validateEducations()) return;
    if (!validateCareers()) return;
    if (!validateSkills()) return;
    if (!validateLanguages()) return;
    if (!validateCert()) return;
    const updatedHtml = getPreviewHtml();
    try {
      const res = await axios.post("/api/resume/saveModifiedResume", {
        userNo: user.userNo,
        resumeInfo: resumeInfo,
        templateNo: resumeInfo.templateNo,
        html: updatedHtml,
      });
      setIsDownload(true);
      if (res.result === 1) {
        const path = res.filePath;
        setResumeFilePath(path);
        alert("수정된 이력서 저장이 완료되었습니다");
        return path;
      } else {
        alert("이력서 저장에 실패했습니다");
        throw new Error("저장 실패");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  //이력서 PDF로 저장
  const pdfSubmit = async (filePath) => {
    console.log("filePath : ", filePath);
    const path = filePath || resumeFilePath;
    console.log("resume filePath : ", path);
    try {
      const res = await axios.post(
        "/api/resume/exportPdf",
        { filePath: path },
        { responseType: "arraybuffer", maxBodyLength: Infinity }
      );
      const blob = new Blob([res], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setIsDownload(false);
      setResumeFilePath("");
      onClose();
    } catch (error) {
      console.error(error.response || error);
      alert("PDF 다운로드 중 오류가 발생했습니다.");
    }
  };

  //이력서 저장 및 PDF로 저장
  const pdfDownload = async () => {
    if (!validateProfile()) return;
    if (!validateEducations()) return;
    if (!validateCareers()) return;
    if (!validateSkills()) return;
    if (!validateLanguages()) return;
    if (!validateCert()) return;
    try {
      if (!download) {
        const path = await saveModify();
        await new Promise((r) => setTimeout(r, 1000));
        await pdfSubmit(path);
      } else {
        await pdfSubmit();
      }
    } catch (error) {}
  };

  const handleClose = () => {
    //모달창 닫을 시 기본값 초기화
    if (initalResumeInfo && initHtmlcontent) {
      setHtmlContent(initHtmlcontent);
      setResumeInfo(initalResumeInfo);
    }
    setSelectedRadio("");
    setAiComment("");
    setIsDownload(false);
    onClose();
  };

  // Ai Comment 받아오기
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

  //개인프로필 유효성 검사
  const validateProfile = () => {
    const requiredFields = ["name", "title", "email", "phone"];
    for (const field of requiredFields) {
      if (!resumeInfo[field] || resumeInfo[field].toString().trim() === "") {
        alert("개인정보 필수 항목을 입력해주세요");
        return false;
      }
    }
    return true;
  };

  //학력 유효성 검사
  const validateEducations = () => {
    for (const edu of resumeInfo.education) {
      const requiredFields = [
        "school_name",
        "enroll_date",
        "grad_date",
        "edu_status",
        "major",
        "gpa",
      ];

      for (const field of requiredFields) {
        if (field === "grad_date" && edu.isCurrentEdu) continue;
        if (!edu[field] || edu[field].toString().trim() === "") {
          alert("학력 필수 항목을 입력해주세요");
          return false;
        }
      }
    }
    return true;
  };

  //경력 유효성 검사
  const validateCareers = () => {
    for (const career of resumeInfo.career) {
      const requiredFields = [
        "company_name",
        "start_date",
        "end_date",
        "position",
      ];
      for (const field of requiredFields) {
        if (field === "end_date" && career.isCurrentJob) continue;
        if (!career[field] || career[field].toString().trim() === "") {
          alert("경력 필수 항목을 입력해주세요");
          return false;
        }
      }
    }
    return true;
  };

  //언어 유효성 검사
  const validateLanguages = () => {
    const languageList = resumeInfo.languages.map((lang) =>
      lang.language.trim()
    );
    const isDuplicate = new Set(languageList).size !== languageList.length;
    if (isDuplicate) {
      alert("동일한 언어가 중복 입력되었습니다");
      return false;
    }
    return true;
  };

  //스킬 유효성 검사
  const validateSkills = () => {
    for (const skill of resumeInfo.skills) {
      const requiredFields = ["skill_code", "group_code", "exp_level"];

      for (const field of requiredFields) {
        if (!skill[field] || skill[field].toString().trim() === "") {
          alert("스킬 항목을 선택해주세요");
          return false;
        }
      }
    }
    return true;
  };

  //자격증 유효성 검사
  const validateCert = () => {
    for (const cert of resumeInfo.certifications) {
      const requiredFields = [
        "certificate_no",
        "certificate_name",
        "issuing_org",
        "acquired_date",
      ];

      for (const field of requiredFields) {
        if (!cert[field] || cert[field].toString().trim() === "") {
          alert("자격증 필수 항목을 입력해주세요");
          return false;
        }
      }
    }
    return true;
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

        <div className="templete-test">
          <TemplateSelection
            formData={resumeInfo}
            editType={"U"}
            setResumeInfo={setResumeInfo}
            setInitHtmlContent={setInitHtmlContent}
            setHtmlContent={setHtmlContent}
          >
            템플렛선택
          </TemplateSelection>
        </div>

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
        <div className="publication_title">
          <h3> 이력서 공개 여부 </h3>
        </div>

        <div className="publication_ratio_area">
          <input
            type="radio"
            name="publication_yn"
            id="public"
            value="Y"
            onChange={publicationToggle}
            checked={resumeInfo.publication_yn === "Y"}
            className="custom-radio"
          />
          <label htmlFor="public" className="radio-label">
            공개
          </label>

          <input
            type="radio"
            name="publication_yn"
            id="private"
            value="N"
            onChange={publicationToggle}
            checked={resumeInfo.publication_yn === "N"}
            className="custom-radio"
          />
          <label htmlFor="private" className="radio-label">
            비공개
          </label>
        </div>

        <div className="buttonRow">
          {download ? (
            <button className="secondaryBtn" onClick={pdfDownload}>
              PDF 파일 다운로드
            </button>
          ) : (
            <>
              <button className="secondaryBtn" onClick={saveModify}>
                수정 사항 저장
              </button>
              <button className="secondaryBtn" onClick={pdfDownload}>
                이력서 수정사항 저장 및 PDF 다운로드
              </button>
            </>
          )}

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
