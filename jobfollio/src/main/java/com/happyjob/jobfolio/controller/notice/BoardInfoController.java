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
@RequestMapping("/api")
public class BoardInfoController {

    private final BoardInfoService boardInfoService;

    public BoardInfoController(BoardInfoService boardInfoService) {
        this.boardInfoService = boardInfoService;
    }

    @GetMapping("/admin/board/list")
    public ResponseEntity<List<BoardInfoVo>> getBoardList(
			@RequestParam String board_type,
			@RequestParam(required = false) Integer userNo) {
	/*	boolean isAdmin = userNo != null && userNo <= 4;*/
		List<BoardInfoVo> list = boardInfoService.getBoardsByType(board_type);
		System.out.println(list);
        return ResponseEntity.ok(list);
    }

	@GetMapping("/board/user/info/list")
	public ResponseEntity<List<BoardInfoVo>> getPublicInfoList(@RequestParam String board_type,
														  @RequestParam(required = false) Integer userNo) {
		boolean isAdmin = false;
		return ResponseEntity.ok(boardInfoService.getPublicInfoList(board_type));
	}

	@GetMapping("/board/user/faq/list")
	public ResponseEntity<List<BoardInfoVo>> getPublicFaqList(@RequestParam String board_type,
																@RequestParam(required = false) Integer userNo) {
		boolean isAdmin = false;
		return ResponseEntity.ok(boardInfoService.getPublicFaqList(board_type));
	}
    
    // 게시글 등록
    @PostMapping("/admin/board/insert")
    public ResponseEntity<String> insertBoardInfo(@RequestBody BoardInfoVo vo) {
		System.out.println(vo.toString());
    	try {
    		boardInfoService.insertBoardInfo(vo);
    		return ResponseEntity.ok("등록성공");
    	}catch (Exception e) {
    		e.printStackTrace();
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("등록 실패 : " + e.getMessage());
    	}
    }
    
    @PostMapping("/admin/board/delete")
    public ResponseEntity<String> deleteBoardInfo(@RequestBody List<Integer> ids) {
    	boardInfoService.deleteBoardInfo(ids);
    	return ResponseEntity.ok("삭제 성공");
    }
    

    @PutMapping("/admin/board/update")
    public ResponseEntity<String> updateBoardInfo(@RequestBody BoardInfoVo vo){
    	try {
    		boardInfoService.updateBoardInfo(vo);
    		return ResponseEntity.ok("수정성공");
    	}catch (Exception e) {
    		e.printStackTrace();
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("등록 실패 : " + e.getMessage());
    	}
    }
    
    @PostMapping("/admin/board/updatePriority")
    public ResponseEntity<String> updatePriority(@RequestBody Map<String, Object> payload) {
    	try {
			int id = (int) payload.get("id");
			String board_type = (String) payload.get("board_type");
			int newPriority = (int) payload.get("newPriority");

			boardInfoService.updatePriority(id, board_type, newPriority);

			return ResponseEntity.ok("우선순위 변경 완료");

		}catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("우선순위 오류: " + e.getMessage());
	  }catch (Exception e) {
		  e.printStackTrace();
		  return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
	  }
    }

	@PostMapping("/admin/board/updateStatus")
	public ResponseEntity<String> updateStatus(@RequestBody Map<String, Object> payload) {
		int id = (int) payload.get("id");
		String statusYn = (String) payload.get("status_yn");

		boardInfoService.updateStatusYn(id, statusYn);
		return ResponseEntity.ok("표시여부 변경 성공");
	}
    
    

}