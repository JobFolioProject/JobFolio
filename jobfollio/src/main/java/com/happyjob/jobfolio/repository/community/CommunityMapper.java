package com.happyjob.jobfolio.repository.community;

import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommunityMapper {

    List<CommunityBoardVo> selectPriorityBoardList(Map<String, Object> paramMap);
    List<CommunityBoardVo> selectNormalBoardPaged(Map<String, Object> paramMap);
    int countNormalBoardList(Map<String, Object> paramMap);

    CommunityBoardVo selectBoardDetail(int boardNo);

    // 이전, 다음글
    CommunityBoardVo selectPreviousPost(Map<String, Object> param);
    CommunityBoardVo selectNextPost(Map<String, Object> param);
}
