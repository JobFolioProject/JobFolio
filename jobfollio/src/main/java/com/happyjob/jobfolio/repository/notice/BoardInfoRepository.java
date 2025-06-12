package com.happyjob.jobfolio.repository.notice;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.happyjob.jobfolio.vo.notice.BoardInfoVo;

@Mapper
public interface BoardInfoRepository {
	
	List<BoardInfoVo> selectByBoardType(@Param("board_type") String board_type);
	
	int getNextPriority();
	void insertBoardInfo(BoardInfoVo vo);

}