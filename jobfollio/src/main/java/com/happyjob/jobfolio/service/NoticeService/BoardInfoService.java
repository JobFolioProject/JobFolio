package com.happyjob.jobfolio.service.NoticeService;

import java.io.File;
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
		return boardInfoRepository.selectByBoardType(board_type);
	}
	
	public void insertBoardInfo(BoardInfoVo vo) {
		int nexBoardNo = boardInfoRepository.getNextBoardNo(vo.getBoard_type());
		vo.setId(nexBoardNo);
		
		vo.setPriority(boardInfoRepository.getNextPriority(vo.getBoard_type()));
		
		boardInfoRepository.insertBoardInfo(vo);
	}
	
	public void deleteBoardInfo(List<Integer> ids) {
		for(int id : ids) {
			BoardInfoVo item = boardInfoRepository.selectOne(id);
			if(item != null) {
				boardInfoRepository.shiftPriorityAfterDelete(item.getBoard_type(), item.getPriority());
				boardInfoRepository.deleteBoardInfoById(id);
			}
		}
	}
	
	public void updateBoardInfo(BoardInfoVo vo) {
		boardInfoRepository.updateBoardInfo(vo);
	}
	
	public void updatePriority(int id, String board_type, int newPriority) {
		boardInfoRepository.shiftPriorities(id, board_type, newPriority); //밑에 애들 밀기
		boardInfoRepository.updateOwnPriority(id, newPriority); // 본인 우선순서 바꾸기 
	}
	
}