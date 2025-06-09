package com.happyjob.jobfolio.repository.shopping;


import com.happyjob.jobfolio.vo.Shopping.ShoppingModel;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

import com.happyjob.jobfolio.vo.Shopping.ShoppingModel;

@Mapper
public interface ShoppingMapper {

    public List<ShoppingModel>  productlist(Map<String, Object> parammap);

    public ShoppingModel  productdetail(Map<String, Object> parammap);

    public List<ShoppingModel>  imagelist(Map<String, Object> parammap);

}
