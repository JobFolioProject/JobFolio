package com.happyjob.jobfolio.repository.admin;

import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminCommunityMapper {

    // 공지사항 등록
    int insertBoard(CommunityBoardVo vo);

    // 공지사항 수정
    int updateBoard(CommunityBoardVo vo);

    // 공지사항 삭제
    int deleteBoard(@Param("boardNo") int boardNo);
}
