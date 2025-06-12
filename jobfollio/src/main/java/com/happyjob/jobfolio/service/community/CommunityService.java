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

    public List<CommunityBoardVo> getCommunityBoardPaged(Map<String, Object> paramMap) {
        return communityMapper.selectBoardListPaged(paramMap);
    }

    public int getBoardTotalCount(Map<String, Object> paramMap) {
        return communityMapper.countBoardList(paramMap);
    }
}
