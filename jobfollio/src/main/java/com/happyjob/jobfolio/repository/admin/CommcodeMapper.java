package com.happyjob.jobfolio.repository.admin;

import com.happyjob.jobfolio.vo.admin.CommcodeModel;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

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