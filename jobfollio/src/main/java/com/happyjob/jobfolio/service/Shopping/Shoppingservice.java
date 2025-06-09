package com.happyjob.jobfolio.service.Shopping;

import com.happyjob.jobfolio.vo.Shopping.ShoppingModel;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Map;

import com.happyjob.jobfolio.repository.shopping.ShoppingMapper;

@Service
public class Shoppingservice {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    // Get class name for logger
    private final String className = this.getClass().toString();


    @Autowired
    private ShoppingMapper shoppingMapper;

    public List<ShoppingModel>  productlist(Map<String, Object> parammap) {

       return shoppingMapper.productlist(parammap);
    }

    public ShoppingModel  productdetail(Map<String, Object> parammap) {

        return shoppingMapper.productdetail(parammap);
    }

    public List<ShoppingModel>  imagelist(Map<String, Object> parammap) {

        return shoppingMapper.imagelist(parammap);
    }


}
