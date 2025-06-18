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

    // 공지사항 일괄 삭제
    void deleteBoardBatch(List<Integer> boardNos);

    // 우선순위 조회
    int selectPriority(@Param("boardNo") int boardNo);

    // 우선순위 개별 변경
    void updatePriority(@Param("boardNo") int boardNo, @Param("priority") int priority);
    // 우선순위 일괄 변경
    void updatePriorityBatch(@Param("updates") List<CommunityBoardVo> updates);

    // 공지 고정 해제
    void unpinBoardList(@Param("boardNos") List<Integer> boardNos);

    // 공개/비공개 토글
    void updateStatusYn(@Param("boardNo") int boardNo, @Param("statusYn") String statusYn);

}
