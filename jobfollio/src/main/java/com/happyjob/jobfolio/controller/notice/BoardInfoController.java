package com.happyjob.jobfolio.controller.notice;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.happyjob.jobfolio.service.NoticeService.BoardInfoService;
import com.happyjob.jobfolio.vo.notice.BoardInfoVo;

@RestController
@RequestMapping("/api/info")
public class BoardInfoController {

    private final BoardInfoService boardInfoService;

    public BoardInfoController(BoardInfoService boardInfoService) {
        this.boardInfoService = boardInfoService;
    }

    @GetMapping("/list")
    public List<BoardInfoVo> getBoardList() {
        return boardInfoService.getBoardsByType("I");
    }
    
    @PostMapping
    public ResponseEntity<String> insertBoardInfo(@RequestBody BoardInfoVo vo) {
    	try {
    		vo.setBoard_type("I");
    		boardInfoService.insertBoardInfo(vo);
    		return ResponseEntity.ok("등록성공");
    	}catch (Exception e) {
    		e.printStackTrace();
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("등록 실패 : " + e.getMessage());
    	}
    }
    

}