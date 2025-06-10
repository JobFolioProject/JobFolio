package com.happyjob.jobfolio.vo.resume;

public class LinkInfoVO {

    /** 이력서 고유번호 */
    private int resume_no;

    /** 링크명 */
    private String link_name;

    /** URL */
    private String link_url;

    public int getResume_no() {
        return resume_no;
    }

    public void setResume_no(int resume_no) {
        this.resume_no = resume_no;
    }

    public String getLink_name() {
        return link_name;
    }

    public void setLink_name(String link_name) {
        this.link_name = link_name;
    }

    public String getLink_url() {
        return link_url;
    }

    public void setLink_url(String link_url) {
        this.link_url = link_url;
    }
}
