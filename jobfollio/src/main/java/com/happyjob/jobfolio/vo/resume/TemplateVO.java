package com.happyjob.jobfolio.vo.resume;

public class TemplateVO {

    /** 템플릿번호 */
    private int template_no;

    /** 템플릿명 */
    private String template_name;

    /** 파일물리경로 */
    private String file_pypath;

    /** 파일논리경로 */
    private String file_lopath;

    private String title;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    private String content;


    public int getTemplate_no() {
        return template_no;
    }

    public void setTemplate_no(int template_no) {
        this.template_no = template_no;
    }

    public String getTemplate_name() {
        return template_name;
    }

    public void setTemplate_name(String template_name) {
        this.template_name = template_name;
    }

    public String getFile_pypath() {
        return file_pypath;
    }

    public void setFile_pypath(String file_pypath) {
        this.file_pypath = file_pypath;
    }

    public String getFile_lopath() {
        return file_lopath;
    }

    public void setFile_lopath(String file_lopath) {
        this.file_lopath = file_lopath;
    }
}
