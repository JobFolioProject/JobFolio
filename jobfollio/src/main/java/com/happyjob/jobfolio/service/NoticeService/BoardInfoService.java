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
	
	public List<BoardInfoVo> getBoardsByType(String boardTypeCd) { 
		return boardInfoRepository.selectByBoardType(boardTypeCd);
	}
	
	
}