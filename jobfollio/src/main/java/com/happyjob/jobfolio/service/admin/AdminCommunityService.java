package com.happyjob.jobfolio.service.admin;

import com.happyjob.jobfolio.repository.admin.AdminCommunityMapper;
import com.happyjob.jobfolio.repository.community.CommunityMapper;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import com.happyjob.jobfolio.vo.community.FileInfoVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Paths;
import java.nio.file.Path;
import java.io.IOException;
import java.nio.file.Files;
import java.util.regex.*;
import java.util.*;

@Service
public class AdminCommunityService {

    private final AdminCommunityMapper adminCommunityMapper;
    private final CommunityMapper communityMapper;

    @Autowired
    public AdminCommunityService(AdminCommunityMapper adminCommunityMapper,
                                 CommunityMapper communityMapper) {
        this.adminCommunityMapper = adminCommunityMapper;
        this.communityMapper = communityMapper;
    }

    @Value("${fileUpload.rootPath}")
    private String rootPath;

    @Value("${fileUpload.noticePath}")
    private String noticePath;

    // 공지사항 등록
    @Transactional
    public CommunityBoardVo createNotice(CommunityBoardVo vo) {
        adminCommunityMapper.insertBoard(vo);
        saveImageFileInfo(vo.getBoardNo(), vo.getContent());
        return vo;
    }

    // 공지사항 수정
    @Transactional
    public CommunityBoardVo updateNotice(CommunityBoardVo vo) {
        // 0) 기존 공지의 content(HTML)를 DB에서 조회
        CommunityBoardVo oldVo = communityMapper.selectBoardDetail(vo.getBoardNo());
        String oldContent = oldVo.getContent();
        String newContent = vo.getContent();

        // 1) 삭제된 이미지 파일명 목록 구하기
        Set<String> oldFiles = extractFilenames(oldContent);
        Set<String> newFiles = extractFilenames(newContent);

        oldFiles.removeAll(newFiles);  // 이제 oldFiles에는 “삭제된” 파일명만 남음

        // 2) 물리 파일 및 DB 레코드 삭제
        for (String filename : oldFiles) {
            // 물리 파일 삭제
            Path phys = Paths.get(rootPath, noticePath, filename);
            try { Files.deleteIfExists(phys); }
            catch (IOException ignored) { /* 로그만 남겨도 OK */ }

            // DB 레코드 삭제
            adminCommunityMapper.deleteFileInfoByBoardNoAndFilename(vo.getBoardNo(), filename);
        }

        // 3) 게시글 내용 업데이트
        adminCommunityMapper.updateBoard(vo);

        // 4) 남은(새로 추가된) 이미지만 DB에 다시 저장
        saveImageFileInfo(vo.getBoardNo(), newContent);

        return vo;
    }

    private Set<String> extractFilenames(String html) {
        Pattern p = Pattern.compile("/api/community/image/([^\"'>]+)");
        Matcher m = p.matcher(html);

        Set<String> filenames = new HashSet<>();
        while (m.find()) {
            filenames.add(m.group(1));
        }
        return filenames;
    }

    // 공지사항 삭제
    @Transactional
    public void deleteNotice(int boardNo) {
        // 1) 컨텐츠 가져오기
        CommunityBoardVo vo = communityMapper.selectBoardDetail(boardNo);

        // 2) 본문 내 이미지 파일 삭제
        deleteFilesByContent(vo.getContent());

        // 3) DB에 저장된 파일정보 조회·삭제
        List<FileInfoVo> files = adminCommunityMapper.selectFileInfoByBoardNo(boardNo);
        for (FileInfoVo f : files) {
            try {
                Files.deleteIfExists(Paths.get(f.getFilePypath()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        adminCommunityMapper.deleteFileInfoByBoardNo(boardNo);

        // 4) 게시글 레코드 삭제
        adminCommunityMapper.deleteBoard(boardNo);
    }

    // 공지사항 일괄 삭제
    @Transactional
    public void deleteNoticeBatch(List<Integer> boardNos) {
        for (int no : boardNos) {
            deleteNotice(no);
        }
    }

    // 파일 삭제
    private void deleteFilesByContent(String contentHtml) {
        Pattern p = Pattern.compile("/api/community/image/([^\"'>]+)");
        Matcher m = p.matcher(contentHtml);
        while (m.find()) {
            String filename = m.group(1);
            Path phys = Paths.get(rootPath, noticePath, filename);
            try {
                Files.deleteIfExists(phys);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    @Transactional
    public void deleteFileInfoByFilename(FileInfoVo vo) {
        adminCommunityMapper.deleteFileInfoByFilename(vo.getBoardNo(), vo.getFileName());
    }

    // 우선순위 변경
    public void updatePriority(int boardNo, int newPriority) {
        adminCommunityMapper.updatePriority(boardNo, newPriority);
    }
    // 우선순위 배열 변경
    @Transactional
    public void updatePriorityBatch(List<CommunityBoardVo> updates) {
        adminCommunityMapper.updatePriorityBatch(updates);
    }
    // 공지 고정 해제
    @Transactional
    public void unpinBoardList(List<Integer> boardNos) {
        adminCommunityMapper.unpinBoardList(boardNos);
    }
    // 우선순위 스왑
    @Transactional
    public void swapPriority(int boardNo1, int boardNo2) {
        Integer priority1 = adminCommunityMapper.selectPriority(boardNo1);
        Integer priority2 = adminCommunityMapper.selectPriority(boardNo2);

        // 예외 처리 추가
        if (priority1 == null || priority2 == null) {
            throw new IllegalArgumentException("해당 게시글의 우선순위를 찾을 수 없습니다.");
        }

        adminCommunityMapper.updatePriority(boardNo1, priority2);
        adminCommunityMapper.updatePriority(boardNo2, priority1);
    }

    // 공개/비공개 토글
    public void updateStatusYn(int boardNo, String statusYn) {
        adminCommunityMapper.updateStatusYn(boardNo, statusYn);
    }

    private void saveImageFileInfo(int boardNo, String contentHtml) {
        Pattern p = Pattern.compile("src=[\"']/api/community/image/([^\"'>]+)[\"']");
        Matcher m = p.matcher(contentHtml);
        List<FileInfoVo> files = new ArrayList<>();

        while (m.find()) {
            String filename = m.group(1);  // ex) ab12-34cd.png
            FileInfoVo f = new FileInfoVo();
            f.setBoardNo(boardNo);
            f.setFileName(filename);
            f.setExtension(filename.substring(filename.lastIndexOf('.') + 1));

            // 물리경로 (rootPath/noticePath/filename)
            Path phys = Paths.get(rootPath, noticePath, filename);
            f.setFilePypath(phys.toString());

            // 논리경로 (API로 노출되는 URL)
            f.setFileLopath("/api/community/image/" + filename);

            files.add(f);
        }

        if (!files.isEmpty()) {
            adminCommunityMapper.insertFileInfoBatch(files);
        }
    }
}
