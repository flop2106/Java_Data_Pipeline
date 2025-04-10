package io.javaml.datapipeline.java_datapipeline_platform.controller;

import io.javaml.datapipeline.java_datapipeline_platform.dto.PipelineDTO;
import io.javaml.datapipeline.java_datapipeline_platform.dto.StepDTO;
import io.javaml.datapipeline.java_datapipeline_platform.executor.pythonScriptExecutor;
import io.javaml.datapipeline.java_datapipeline_platform.executor.ScriptExecutor;
import io.javaml.datapipeline.java_datapipeline_platform.pipeline.Pipeline;
import io.javaml.datapipeline.java_datapipeline_platform.pipeline.PipelineStep;
import io.javaml.datapipeline.java_datapipeline_platform.JavaDatapipelinePlatformApplication;
import io.javaml.datapipeline.java_datapipeline_platform.database.CSVDatabase;
import io.javaml.datapipeline.java_datapipeline_platform.database.Database;
import io.javaml.datapipeline.java_datapipeline_platform.utils.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") //enable CORS between 2 port
public class PipelineController {

    private final JavaDatapipelinePlatformApplication javaDatapipelinePlatformApplication;
    DynamicPythonRunner runner = new DynamicPythonRunner("temp_env");

    PipelineController(JavaDatapipelinePlatformApplication javaDatapipelinePlatformApplication) {
        this.javaDatapipelinePlatformApplication = javaDatapipelinePlatformApplication;
    }
    @PostMapping("/startPython")
    public ResponseEntity<String> startPython(@RequestBody PipelineDTO pipelineDTO){
        try {
            Map<String, Object> configMap = pipelineDTO.getSteps().get(0).getConfig();
            Map<String, String> configStringMap = configMap.entrySet().stream()
                        .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().toString()));
            String currentDir = System.getProperty("user.dir");
            int envExitCode = runner.createVirtualEnv();
            LogBuffer.addLog("Virtual environment creation exit code: " + envExitCode);
            int installExitCode = runner.installDependencies(configStringMap.get("requirements"));
            LogBuffer.addLog("Dependencies installation exit code: " + installExitCode);
            return ResponseEntity.ok("Python environment started successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Python Environment Creation failed: " + e.getMessage()); 
        }
    }
    @PostMapping("/stopPython")
    public ResponseEntity<String> stopPython(){
        try {
            int deleteEnvCode = runner.deleteVirtualEnv();
            LogBuffer.addLog("Virtual Environment deletion exit code: " + deleteEnvCode);
            return ResponseEntity.ok("Python environment Stopped successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Python environment Stop failed: " + e.getMessage()); 
        }
    }
    @PostMapping("/executePipeline")
    public ResponseEntity<String> executePipeline(@RequestBody PipelineDTO pipelineDTO) {
        try {
            Pipeline pipeline = new Pipeline();
            List<PipelineStep> steps = new ArrayList<>();
            // Convert each DTO to a PipelineStep
            for (StepDTO stepDTO : pipelineDTO.getSteps()) {
                String type = stepDTO.getType().toLowerCase();
                Map<String, Object> configMap = stepDTO.getConfig();
                
                if (type.equals("csvdatabase")) {
                    Map<String, String> configStringMap = configMap.entrySet().stream()
                        .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().toString()));
                    CSVDatabase csvDb = (CSVDatabase) Database.createDatabase("csv", configStringMap);
                    csvDb.configureApi();
                    steps.add(csvDb);
                } else if (type.equals("pythonscript")) {
                    // First, separate out the simple configuration keys (everything except "parameters")
                    Map<String, String> simpleConfig = configMap.entrySet().stream()
                    .filter(e -> !e.getKey().equalsIgnoreCase("parameters"))
                    .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().toString()));

                    Map<String, Object> parametersObj = (Map<String, Object>) configMap.get("parameters");
                    Map<String, String> parametersMap = null;
                    if(parametersObj != null){
                        parametersMap = parametersObj.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, e -> {
                            Map param = (Map) e.getValue();
                            return param.get("value").toString();
                        }));
                    }

                    pythonScriptExecutor lstm = (pythonScriptExecutor) ScriptExecutor.initiateScript("python", simpleConfig, runner);
                    lstm.configureApi(parametersMap);
                    steps.add(lstm);
                } 
            }
            pipeline.setSteps(steps);
            // Execute the pipeline (for API, you might choose executeApi instead)
            pipeline.execute();
            return ResponseEntity.ok("Pipeline executed successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Pipeline execution failed: " + e.getMessage());
        }
    }
}
