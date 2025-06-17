package com.happyjob.jobfolio.service.admin;

import com.happyjob.jobfolio.repository.admin.AdminCommunityMapper;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminCommunityService {

    private final AdminCommunityMapper adminCommunityMapper;

    @Autowired
    public AdminCommunityService(AdminCommunityMapper adminCommunityMapper) {
        this.adminCommunityMapper = adminCommunityMapper;
    }

    // 공지사항 등록
    @Transactional
    public CommunityBoardVo createNotice(CommunityBoardVo vo) {
        adminCommunityMapper.insertBoard(vo);
        return vo;
    }

    // 공지사항 수정
    @Transactional
    public CommunityBoardVo updateNotice(CommunityBoardVo vo) {
        adminCommunityMapper.updateBoard(vo);
        return vo;
    }

    // 공지사항 삭제
    @Transactional
    public void deleteNotice(int boardNo) {
        adminCommunityMapper.deleteBoard(boardNo);
    }

    // 공지사항 일괄 삭제
    @Transactional
    public void deleteNoticeBatch(List<Integer> boardNos) {
        adminCommunityMapper.deleteBoardBatch(boardNos);
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
}
