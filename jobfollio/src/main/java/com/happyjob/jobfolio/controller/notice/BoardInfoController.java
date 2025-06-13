package com.happyjob.jobfolio.controller.notice;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.happyjob.jobfolio.service.NoticeService.BoardInfoService;
import com.happyjob.jobfolio.vo.notice.BoardInfoVo;

@RestController
@RequestMapping("/api/board")
public class BoardInfoController {

    private final BoardInfoService boardInfoService;

    public BoardInfoController(BoardInfoService boardInfoService) {
        this.boardInfoService = boardInfoService;
    }

    @GetMapping("/list")
    public List<BoardInfoVo> getBoardList(@RequestParam("board_type") String boardType) {
        return boardInfoService.getBoardsByType(boardType);
    }
    
    // 게시글 등록
    @PostMapping
    public ResponseEntity<String> insertBoardInfo(@RequestBody BoardInfoVo vo) {
    	try {
    		boardInfoService.insertBoardInfo(vo);
    		return ResponseEntity.ok("등록성공");
    	}catch (Exception e) {
    		e.printStackTrace();
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("등록 실패 : " + e.getMessage());
    	}
    }
    
    @PostMapping("/delete")
    public ResponseEntity<String> deleteBoardInfo(@RequestBody List<Integer> ids) {
    	boardInfoService.deleteBoardInfo(ids);
    	return ResponseEntity.ok("삭제 성공");
    }
    

    @PutMapping
    public ResponseEntity<String> updateBoardInfo(@RequestBody BoardInfoVo vo){
    	try {
    		boardInfoService.updateBoardInfo(vo);
    		return ResponseEntity.ok("수정성공");
    	}catch (Exception e) {
    		e.printStackTrace();
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("등록 실패 : " + e.getMessage());
    	}
    }
    
    @PostMapping("/updatePriority")
    public ResponseEntity<String> updatePriority(@RequestBody Map<String, Object> payload) {
    	try {
    		int id = (int) payload.get("id");
    		String board_type = (String) payload.get("board_type");
    		int newPriority = (int) payload.get("newPriority");
    	
    	boardInfoService.updatePriority(id, board_type, newPriority);
    	return ResponseEntity.ok("우선순위 변경 완료");
	  }catch (Exception e) {
		  e.printStackTrace();
		  return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
	  }
    }
    
    

}