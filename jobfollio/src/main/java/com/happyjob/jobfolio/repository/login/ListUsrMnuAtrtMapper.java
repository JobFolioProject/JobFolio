package com.happyjob.jobfolio.repository.login;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.happyjob.jobfolio.vo.login.LoginVO;
import com.happyjob.jobfolio.vo.login.UserVO;
import com.happyjob.jobfolio.vo.login.LgnInfoModel;
import com.happyjob.jobfolio.vo.login.UsrMnuAtrtModel;
import com.happyjob.jobfolio.vo.login.UsrMnuChildAtrtModel;

@Mapper
public interface ListUsrMnuAtrtMapper {
	List<UsrMnuAtrtModel> listUsrMnuAtrt(Map<String, Object> paramMap);
}
