package io.javaml.datapipeline.java_datapipeline_platform.pipeline;

import io.javaml.datapipeline.java_datapipeline_platform.utils.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The Pipeline class holds an ordered list of PipelineStep instances.
 * It provides methods to add steps, set the entire list (useful for API configuration),
 * and execute all steps sequentially.
 */
public class Pipeline {
    private List<PipelineStep> steps;
    private String instanceId;
    
    public Pipeline() {
        this.steps = new ArrayList<>();
        this.instanceId = UUID.randomUUID().toString();
    }
    
    public String getInstanceId() {
        return instanceId;
    }
    
    public List<PipelineStep> getSteps() {
        return steps;
    }
    
    public void setSteps(List<PipelineStep> steps) {
        this.steps = steps;
    }
    
    public void addStep(PipelineStep step) {
        this.steps.add(step);
    }
    
    public void execute() {
        for (PipelineStep step : steps) {
            LogBuffer.addLog("Executing step: " + step.getName());
            step.execute();
        }
    }
}
