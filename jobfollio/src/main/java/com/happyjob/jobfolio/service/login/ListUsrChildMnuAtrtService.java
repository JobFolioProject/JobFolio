package com.happyjob.jobfolio.service.login;

import java.util.List;
import java.util.Map;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.happyjob.jobfolio.repository.login.ListUsrMnuAtrtMapper;
import com.happyjob.jobfolio.repository.login.LoginMapper;
import com.happyjob.jobfolio.repository.login.LoginProcMapper;
import com.happyjob.jobfolio.repository.login.ListUsrChildMnuAtrtMapper;
import com.happyjob.jobfolio.vo.login.LgnInfoModel;
import com.happyjob.jobfolio.vo.login.LoginVO;
import com.happyjob.jobfolio.vo.login.UserVO;
import com.happyjob.jobfolio.vo.login.UsrMnuAtrtModel;
import com.happyjob.jobfolio.vo.login.UsrMnuChildAtrtModel;

@Service
public class ListUsrChildMnuAtrtService {
	
	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	// Get class name for logger
	private final String className = this.getClass().toString();
	   
	
	@Autowired
	private ListUsrChildMnuAtrtMapper listUsrChildMnuAtrtMapper;
	
	
	/**  사용자 자식 메뉴 권한 */
	public List<UsrMnuChildAtrtModel> listUsrChildMnuAtrt(Map<String, Object> paramMap) {
		return listUsrChildMnuAtrtMapper.listUsrChildMnuAtrt(paramMap);
	}

}
