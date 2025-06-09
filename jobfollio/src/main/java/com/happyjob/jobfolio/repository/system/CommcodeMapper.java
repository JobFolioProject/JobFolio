package com.happyjob.jobfolio.repository.system;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import com.happyjob.jobfolio.vo.system.CommcodeModel;

@Mapper
public interface CommcodeMapper {

	public List<CommcodeModel> listgroupcode(Map<String, Object> paramMap);

	public int totalcntgroupcode(Map<String, Object> paramMap);
	
	public int insertgroupcode(Map<String, Object> paramMap);

	public int updategroupcode(Map<String, Object> paramMap);
	
	public CommcodeModel selectgroupcode(Map<String, Object> paramMap);
	
	public int deletegroupcode(Map<String, Object> paramMap);
	
	public List<CommcodeModel> listdetailcode(Map<String, Object> paramMap);

	public int totalcntdetailcode(Map<String, Object> paramMap);
	
	public int insertdetailcode(Map<String, Object> paramMap);

	public int updatedetailcode(Map<String, Object> paramMap);
		
	public int deletedetailcode(Map<String, Object> paramMap);

	public CommcodeModel selectdetailcode(Map<String, Object> paramMap);
}