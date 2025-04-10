package io.javaml.datapipeline.java_datapipeline_platform.executor;

import io.javaml.datapipeline.java_datapipeline_platform.utils.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class pythonScriptExecutor extends ScriptExecutor {
    private List<String> args;
    private DynamicPythonRunner runner;
    private Scanner scanner;
    private String currentDir;
    Map<String, String> config;
    private Map<String, String> parameters;
    String codeType;
    // No-argument constructor for API use; interactive configuration uses Scanner.
    public pythonScriptExecutor(String codeType, Map<String, String> config, DynamicPythonRunner runner){
        super();
        this.config = config;
        this.runner = runner;
        this.args = new ArrayList<>();
        // For interactive use; for API calls, configuration will be provided via configureApi.
        this.scanner = new Scanner(System.in);
        this.currentDir = System.getProperty("user.dir");
    }
    
    // API configuration: parameters provided via a Map (from a JSON payload, for example)
    @Override
    public void configureApi(Map<String, String> parameters) {
        args.clear();
        this.parameters = parameters;
        if (parameters != null){
            parameters.forEach((key, value) ->{
                args.add("--"+key+"="+value);
            });
        }
    }
    
    // API execution: uses previously configured parameters (via configureApi) and a given folder path.
    @Override
    public void execute() {
        try {
            int runScriptExitCode = runner.runScript(this.config.get("scriptPath"), args);
            LogBuffer.addLog("Script execution exit code: " + runScriptExitCode);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
    
    @Override
    public String getName(){
        return "PythonScript";
    }

}
