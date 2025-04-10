package io.javaml.datapipeline.java_datapipeline_platform.dto;
import java.util.*;

public class StepDTO {
    private String type;
    private Map<String, Object> config;

    public StepDTO(){}

    public String getType(){
        return type;
    }

    public void setType(String type){
        this.type = type;
    }

    public Map<String, Object> getConfig(){
        return config;
    }

    public void setConfig(Map<String, Object> config){
        this.config = config;
    }

    
}
