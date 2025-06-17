package com.happyjob.jobfolio.repository.notice;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.happyjob.jobfolio.vo.notice.BoardInfoVo;

@Mapper
public interface BoardInfoRepository {
	
	List<BoardInfoVo> selectByBoardType(Map<String, Object> param);

	List<BoardInfoVo> selectUserVisibleInfo(Map<String, Object> param);

	List<BoardInfoVo> selectUserVisibleFaq(Map<String, Object> param);
	
	int getNextPriority(String board_type);
	
	int newPriority();
	
	int getNextBoardNo();

	// totalcount max 까지
	int countByType(String board_type);
	
	void insertBoardInfo(BoardInfoVo vo);
	
	void deleteBoardInfo(@Param("ids") List<Integer> ids);
	
	void updateBoardInfo(BoardInfoVo vo);
	
	void shiftPriorityAfterDelete(@Param("board_type") String boardType, @Param("priority") int priority,  @Param("totalCount") int totalCount);
	
	void deleteBoardInfoById(@Param("id") int id);
	
	void updateOwnPriority(@Param("id") int id, @Param("priority") int priority);
	
	BoardInfoVo selectOne(@Param("id") int id);
	
	void shiftPrioritiesDown(Map<String, Object> paramMap);

	void shiftPrioritiesUp(Map<String, Object> paramMap);

	void updateStatusYn(Map<String, Object> param);

}