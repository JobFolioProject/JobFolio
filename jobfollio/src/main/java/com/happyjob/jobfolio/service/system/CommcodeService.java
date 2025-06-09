package com.happyjob.jobfolio.service.system;

import java.util.List;
import java.util.Map;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.happyjob.jobfolio.repository.system.CommcodeMapper;

import com.happyjob.jobfolio.vo.system.CommcodeModel;

@Service
public class CommcodeService {

	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	// Get class name for logger
	private final String className = this.getClass().toString();

	@Autowired
	private CommcodeMapper commcodeMapper;

	public List<CommcodeModel> listgroupcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.listgroupcode(paramMap);
	}

	public int totalcntgroupcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.totalcntgroupcode(paramMap);
	}
	
	public int insertgroupcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.insertgroupcode(paramMap);
	}
	
	public int updategroupcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.updategroupcode(paramMap);
	}
	
	public CommcodeModel selectgroupcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.selectgroupcode(paramMap);
	}
	
	public int deletegroupcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.deletegroupcode(paramMap);
	}
	
	public List<CommcodeModel> listdetailcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.listdetailcode(paramMap);
	}

	public int totalcntdetailcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.totalcntdetailcode(paramMap);
	}
	
	public int insertdetailcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.insertdetailcode(paramMap);
	}
	
	public int updatedetailcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.updatedetailcode(paramMap);
	}	
	
	public int deletedetailcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.deletedetailcode(paramMap);
	}
	
	public CommcodeModel selectdetailcode(Map<String, Object> paramMap) throws Exception {
		return commcodeMapper.selectdetailcode(paramMap);
	}
}