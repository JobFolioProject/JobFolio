package com.happyjob.jobfolio.repository.admin;

import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import com.happyjob.jobfolio.vo.community.FileInfoVo;
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

    // 수정시 파일
    void deleteFileInfoByBoardNoAndFilename(
            @Param("boardNo") int boardNo,
            @Param("filename") String filename
    );

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

    // 파일정보 단건 저장
    int insertFileInfo(FileInfoVo fileInfo);

    // 파일정보 일괄 저장
    int insertFileInfoBatch(@Param("list") List<FileInfoVo> list);

    // 게시글(boardNo)에 딸린 파일 목록 조회
    List<FileInfoVo> selectFileInfoByBoardNo(@Param("boardNo") int boardNo);

    // 게시글 삭제시 파일 정보 삭제
    int deleteFileInfoByBoardNo(@Param("boardNo") int boardNo);

    void deleteFileInfoByFilename(@Param("boardNo") int boardNo,
                                  @Param("fileName") String fileName);

}
