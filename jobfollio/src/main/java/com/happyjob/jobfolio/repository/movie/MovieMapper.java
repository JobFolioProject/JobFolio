package com.happyjob.jobfolio.repository.movie;


import com.happyjob.jobfolio.vo.movie.MovieModel;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface MovieMapper {

    public List<MovieModel>  movielist(Map<String, Object> parammap);
    
    public int  movielisttotalcnt(Map<String, Object> parammap);

    public MovieModel  moviedetail(Map<String, Object> parammap);


}
