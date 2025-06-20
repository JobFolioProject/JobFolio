package com.happyjob.jobfolio.service.movie;

import com.happyjob.jobfolio.repository.movie.MovieMapper;
import com.happyjob.jobfolio.vo.movie.MovieModel;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class Movieservice {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    // Get class name for logger
    private final String className = this.getClass().toString();


    @Autowired
    private MovieMapper movieMapper;

    public List<MovieModel>  movielist(Map<String, Object> parammap) {

       return movieMapper.movielist(parammap);
    }
    
    public int  movielisttotalcnt(Map<String, Object> parammap) {

        return movieMapper.movielisttotalcnt(parammap);
     }

    public MovieModel  moviedetail(Map<String, Object> parammap) {

        return movieMapper.moviedetail(parammap);
    }


}
