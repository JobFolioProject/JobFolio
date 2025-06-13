package com.happyjob.jobfolio.repository.notice;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.happyjob.jobfolio.vo.notice.BoardInfoVo;

@Mapper
public interface BoardInfoRepository {
	
	List<BoardInfoVo> selectByBoardType(@Param("board_type") String board_type);
	
	int getNextPriority(String board_type);
	
	int newPriority();
	
	int getNextBoardNo(String board_type);
	
	void insertBoardInfo(BoardInfoVo vo);
	
	void deleteBoardInfo(@Param("ids") List<Integer> ids);
	
	void updateBoardInfo(BoardInfoVo vo);
	
	void shiftPriorityAfterDelete(@Param("board_type") String boardType, @Param("priority") int priority);
	
	void deleteBoardInfoById(@Param("id") int id);
	
	void updateOwnPriority(@Param("id") int id, @Param("priority") int priority);
	
	BoardInfoVo selectOne(@Param("id") int id);
	
	void shiftPriorities(@Param("id") int id, @Param("board_type") String boardType, @Param("newpriority") int newpriority);

}