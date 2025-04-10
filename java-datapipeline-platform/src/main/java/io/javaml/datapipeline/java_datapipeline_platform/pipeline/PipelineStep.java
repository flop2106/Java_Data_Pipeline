package io.javaml.datapipeline.java_datapipeline_platform.pipeline;

/**
 * Interface for a pipeline step.
 */
public interface PipelineStep {
    /**
     * Execute the step interactively.
     */
    void execute();

    /**
     * Returns the human-readable name of the step.
     */
    String getName();
}
