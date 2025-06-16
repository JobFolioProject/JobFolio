package com.happyjob.jobfolio.service.admin;

import com.happyjob.jobfolio.repository.admin.AdminCommunityMapper;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
