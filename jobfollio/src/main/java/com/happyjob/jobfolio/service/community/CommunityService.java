package com.happyjob.jobfolio.service.community;

import com.happyjob.jobfolio.repository.community.CommunityMapper;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CommunityService {

    private final CommunityMapper communityMapper;

    @Autowired
    public CommunityService(CommunityMapper communityMapper) {
        this.communityMapper = communityMapper;
    }

    public List<CommunityBoardVo> getPriorityBoardList(Map<String, Object> paramMap) {
        return communityMapper.selectPriorityBoardList(paramMap);
    }

    public List<CommunityBoardVo> getPagedNormalBoardList(Map<String, Object> paramMap) {
        return communityMapper.selectNormalBoardPaged(paramMap);
    }

    public int getNormalBoardTotalCount(Map<String, Object> paramMap) {
        return communityMapper.countNormalBoardList(paramMap);
    }

    public CommunityBoardVo getBoardDetail(int boardNo) {
        return communityMapper.selectBoardDetail(boardNo);
    }

    public CommunityBoardVo getPreviousPost(Map<String, Object> criteria) {
        return communityMapper.selectPreviousPost(criteria);
    }

    public CommunityBoardVo getNextPost(Map<String, Object> criteria) {
        return communityMapper.selectNextPost(criteria);
    }
}
