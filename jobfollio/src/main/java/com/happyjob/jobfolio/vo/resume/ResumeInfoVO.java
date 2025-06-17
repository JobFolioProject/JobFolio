package com.happyjob.jobfolio.vo.resume;
import java.util.List;
import com.happyjob.jobfolio.vo.mypage.EduInfoVO;

public class ResumeInfoVO {

    /** 이력서 고유번호 */
    private int resume_no;

    /** 회원 고유번호 */
    private int user_no;

    /** 이력서 제목 */
    private String title;

    /** 희망 직무 */
    private String desired_position;

    /** 템플릿 번호 */
    private int template_no;

    /** 업로드된 파일명 */
    private String resume_file_name;

    /** 이력서 파일 물리경로 */
    private String resume_file_pypath;

    /** 이력서 파일 논리경로 */
    private String resume_file_lopath;

    /** 사용자가 입력한 자기소개서 내용 (또는 AI 생성 전 입력될 초기값) */
    private String myCoverLetter;

    /** 학력 정보 리스트 (사용자 DB 저장용 아님, AI 프롬프트 생성 시 사용) */
    private List<EduInfoVO> newEducation;

    public List<EduInfoVO> getNewEducation() {
        return newEducation;
    }

    public void setNewEducation(List<EduInfoVO> newEducation) {
        this.newEducation = newEducation;
    }

    public String getMyCoverLetter() {
        return myCoverLetter;
    }

    public void setMyCoverLetter(String myCoverLetter) {
        this.myCoverLetter = myCoverLetter;
    }




    public int getResume_no() {
        return resume_no;
    }

    public void setResume_no(int resume_no) {
        this.resume_no = resume_no;
    }

    public int getUser_no() {
        return user_no;
    }

    public void setUser_no(int user_no) {
        this.user_no = user_no;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDesired_position() {
        return desired_position;
    }

    public void setDesired_position(String desired_position) {
        this.desired_position = desired_position;
    }

    public int getTemplate_no() {
        return template_no;
    }

    public void setTemplate_no(int template_no) {
        this.template_no = template_no;
    }

    public String getResume_file_name() {
        return resume_file_name;
    }

    public void setResume_file_name(String resume_file_name) {
        this.resume_file_name = resume_file_name;
    }

    public String getResume_file_pypath() {
        return resume_file_pypath;
    }

    public void setResume_file_pypath(String resume_file_pypath) {
        this.resume_file_pypath = resume_file_pypath;
    }

    public String getResume_file_lopath() {
        return resume_file_lopath;
    }

    public void setResume_file_lopath(String resume_file_lopath) {
        this.resume_file_lopath = resume_file_lopath;
    }
}
