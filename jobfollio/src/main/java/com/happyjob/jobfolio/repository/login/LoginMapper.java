package com.happyjob.jobfolio.repository.login;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.happyjob.jobfolio.vo.login.LoginVO;
import com.happyjob.jobfolio.vo.login.UserVO;

@Mapper
public interface LoginMapper {
	UserVO login(LoginVO vo);
}

