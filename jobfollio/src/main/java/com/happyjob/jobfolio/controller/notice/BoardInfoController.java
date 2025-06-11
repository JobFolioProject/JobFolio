package com.happyjob.jobfolio.controller.notice;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
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

}