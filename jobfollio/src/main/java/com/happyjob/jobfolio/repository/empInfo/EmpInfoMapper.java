package com.happyjob.jobfolio.repository.empInfo;


import com.happyjob.jobfolio.vo.empInfo.EmpInfoModel;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface EmpInfoMapper {

    public List<EmpInfoModel>  empInfolist(Map<String, Object> parammap);
    
    public List<EmpInfoModel>  empDeptlist(Map<String, Object> parammap);

    public int  empInfolisttotalcnt(Map<String, Object> parammap);

    public EmpInfoModel  empInfodetail(Map<String, Object> parammap);

	public int insertEmpInfo(Map<String, Object> paramMap);

	public int updateEmpInfo(Map<String, Object> paramMap);


}
