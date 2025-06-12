package com.happyjob.jobfolio.repository.community;

import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommunityMapper {

    List<CommunityBoardVo> selectBoardListPaged(Map<String, Object> paramMap);

    int countBoardList(Map<String, Object> paramMap);
}
