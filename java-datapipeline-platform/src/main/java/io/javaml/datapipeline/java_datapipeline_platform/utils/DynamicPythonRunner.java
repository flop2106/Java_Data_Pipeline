package io.javaml.datapipeline.java_datapipeline_platform.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.io.File;

public class DynamicPythonRunner {
    private String envName;
    private String currentDir;

    public DynamicPythonRunner(String envName){
        this.envName = envName;
        this.currentDir = System.getProperty("user.dir");
    }

    private int prepCommand(String... args) throws Exception{
        List<String> command = new ArrayList<>();
        for (String arg: args){
           command.add(arg); 
        }
        ProcessBuilder pb = new ProcessBuilder(command);
        pb.inheritIO();
        Process process = pb.start();
        int exitCode = process.waitFor();
        return exitCode;

    }
    public int createVirtualEnv() throws Exception{
        LogBuffer.addLog("Creating Temporary Python Virtual Env");
        return prepCommand("python","-m","venv",envName);
    }

    public int installDependencies(String requirementsPath) throws Exception{
        LogBuffer.addLog("Installing Dependencies");
        return prepCommand((envName + "/Scripts/pip"),"install","-r",requirementsPath);
    }

    public int deleteVirtualEnv() throws Exception{
        LogBuffer.addLog("Deleting Python Temporary Env");
        return prepCommand("cmd.exe","/c","rmdir", "/S", "/Q",(currentDir + "\\" + envName));
    }

    public int runScript(String scriptPath, List<String> args) throws Exception{
        LogBuffer.addLog("Running Python Model Scripts");
        List<String> command = new ArrayList<>();
        command.add(envName + "/Scripts/python");
        command.add(scriptPath);
        if (args!= null && !args.isEmpty()){
            command.addAll(args);
        }

        ProcessBuilder pb = new ProcessBuilder(command);
        pb.redirectErrorStream(true);
        Process process = pb.start();

        try(BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))){
            String line;
            while ((line = reader.readLine()) != null){
                LogBuffer.addLog("Python Output: " + line);
            }
        }
        int exitCode = process.waitFor();
        return exitCode;

    }

    public void defaultScriptRun(DynamicPythonRunner runner, List<String> scriptArgs, String path){
        try {
        int envExitCode = runner.createVirtualEnv();
        LogBuffer.addLog("Virtual environment creation exit code: " + envExitCode);
        int installExitCode = runner.installDependencies(this.currentDir+path+"\\requirements.txt");
        LogBuffer.addLog("Dependencies installation exit code: " + installExitCode);
        int runScriptExitCode = runner.runScript(this.currentDir+path+"\\lstm.py", scriptArgs);
        LogBuffer.addLog("Script execution exit code: " + runScriptExitCode);
        int deleteEnvCode = runner.deleteVirtualEnv();
        LogBuffer.addLog("Virtual Environment deletion exit code: " + deleteEnvCode);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
    
}
