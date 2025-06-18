package com.happyjob.jobfolio.vo.community;

public class FileInfoVo {
    private String fileName;
    private int    boardNo;
    private String filePypath;  // 물리경로 (절대경로 또는 rootPath+noticePath 조합)
    private String fileLopath;   // 논리경로 (URL)
    private String extension;

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public int getBoardNo() {
        return boardNo;
    }

    public void setBoardNo(int boardNo) {
        this.boardNo = boardNo;
    }

    public String getFilePypath() {
        return filePypath;
    }

    public void setFilePypath(String filePypath) {
        this.filePypath = filePypath;
    }

    public String getFileLopath() {
        return fileLopath;
    }

    public void setFileLopath(String fileLopath) {
        this.fileLopath = fileLopath;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }
}