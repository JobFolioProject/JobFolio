package com.happyjob.jobfolio.service.NoticeService;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.happyjob.jobfolio.common.comnUtils.FileUtilCho;

import com.happyjob.jobfolio.repository.notice.BoardInfoRepository;
import com.happyjob.jobfolio.vo.notice.BoardInfoVo;

@Service
public class BoardInfoService {
	
	private final BoardInfoRepository boardInfoRepository;
	
	public BoardInfoService(BoardInfoRepository boardInfoRepository) {
		this.boardInfoRepository = boardInfoRepository; 
	}
	
	public List<BoardInfoVo> getBoardsByType(String board_type) {
		Map<String, Object> param = new HashMap<>();
		param.put("board_type", board_type);
		return boardInfoRepository.selectByBoardType(param);
	}

	public List<BoardInfoVo> getPublicInfoList(String board_type){
		Map<String, Object> param = new HashMap<>();
		param.put("board_type", board_type);
		return boardInfoRepository.selectUserVisibleInfo(param);
	}

	public List<BoardInfoVo> getPublicFaqList(String board_type){
		Map<String, Object> param = new HashMap<>();
		param.put("board_type", board_type);
		return boardInfoRepository.selectUserVisibleFaq(param);
	}

	
	public void insertBoardInfo(BoardInfoVo vo) {
		int nexBoardNo = boardInfoRepository.getNextBoardNo();
		vo.setId(nexBoardNo);
		
		vo.setPriority(boardInfoRepository.getNextPriority(vo.getBoard_type()));
		
		boardInfoRepository.insertBoardInfo(vo);
	}
	
	public void deleteBoardInfo(List<Integer> ids) {
		for(int id : ids) {
			BoardInfoVo item = boardInfoRepository.selectOne(id);
			if(item != null) {
				boardInfoRepository.shiftPriorityAfterDelete(
						item.getBoard_type(),
						item.getPriority(),
						boardInfoRepository.countByType(item.getBoard_type() ));
				boardInfoRepository.deleteBoardInfoById(id);
			}
		}
	}
	
	public void updateBoardInfo(BoardInfoVo vo) {
		boardInfoRepository.updateBoardInfo(vo);
	}


	public void updatePriority(int id, String board_type, int newPriority) {
		int totalCount = boardInfoRepository.countByType(board_type); // 전체 게시글 개수
		System.out.println("총 개수 = " +  totalCount + ", 요청값 = " + newPriority);

		if (newPriority < 1 || newPriority > totalCount) {
			throw new IllegalArgumentException("우선순위는 1 이상" + totalCount + "이하만 가능합니다.");
		}

		// 현재 우선순위 조회
		BoardInfoVo current =  boardInfoRepository.selectOne(id);
		int currentPriority = current.getPriority();

		Map<String,Object> paramMap = new HashMap<>();
		paramMap.put("id", id);
		paramMap.put("board_type", board_type);
		paramMap.put("newPriority", newPriority);
		paramMap.put("currentPriority", currentPriority);

		if ( newPriority > currentPriority) {
			// 아래로 이동 -1값 처리
			boardInfoRepository.shiftPrioritiesDown(paramMap);
		}else if ( newPriority < currentPriority) {
			// 위로 이동 +1값 처리
			boardInfoRepository.shiftPrioritiesUp(paramMap);
		}

		boardInfoRepository.updateOwnPriority(id, newPriority); // 본인 우선순서 바꾸기 
	}

	public void updateStatusYn(int id, String statusYn) {
		Map<String, Object> param = new HashMap<>();
		param.put("id", id);
		param.put("status_yn", statusYn);
		boardInfoRepository.updateStatusYn(param);
	}

}