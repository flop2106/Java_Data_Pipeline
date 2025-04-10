package io.javaml.datapipeline.java_datapipeline_platform.executor;

import java.util.Map;

import io.javaml.datapipeline.java_datapipeline_platform.pipeline.PipelineStep;
import io.javaml.datapipeline.java_datapipeline_platform.utils.DynamicPythonRunner;

public abstract class ScriptExecutor implements PipelineStep {
    Map<String, String> config;
    String mlType;

    public ScriptExecutor(){

    }
    public static ScriptExecutor initiateScript(String codeType, Map<String, String> config, DynamicPythonRunner runner){
        if ("python".equalsIgnoreCase(codeType)) {
            return new pythonScriptExecutor(codeType, config, runner);
        } else {
            throw new IllegalArgumentException("Invalid Code Type: " + codeType);
        }
    }
    /**
     * Configure the code (e.g., set hyperparameters, file paths).
     */
    public abstract void configureApi(Map<String, String> parameters);

    /**
     * Execute the code interactively.
     */
    public abstract void execute();

    /**
     * Returns the code language's name.
     */
    @Override
    public abstract String getName();

}
