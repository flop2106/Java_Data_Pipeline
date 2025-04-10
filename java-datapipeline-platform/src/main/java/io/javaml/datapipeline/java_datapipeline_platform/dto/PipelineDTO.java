package io.javaml.datapipeline.java_datapipeline_platform.dto;

import java.util.*;

public class PipelineDTO {
        private List<StepDTO> steps;
    
        public PipelineDTO(){}

        public List<StepDTO> getSteps(){
            return steps;
        }

        public void setSteps(List<StepDTO> steps){
            this.steps = steps;
        }
}
