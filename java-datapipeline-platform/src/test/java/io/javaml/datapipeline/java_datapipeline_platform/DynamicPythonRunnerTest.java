package io.javaml.datapipeline.java_datapipeline_platform;
import io.javaml.datapipeline.java_datapipeline_platform.utils.*;

import java.util.ArrayList;
import java.util.List;

public class DynamicPythonRunnerTest {

    public static void main(String[] args) {
        try {
            // Create an instance of DynamicPythonRunner with the environment name "temp_env"
            DynamicPythonRunner runner = new DynamicPythonRunner("temp_env");

            // Step 1: Create the virtual environment
            int envExitCode = runner.createVirtualEnv();
            System.out.println("Virtual environment creation exit code: " + envExitCode);

            // Step 2: Install dependencies from a requirements.txt file
            // Adjust the path as needed. If you don't need dependencies, you can comment out this part.
            int installExitCode = runner.installDependencies("C:\\Users\\7270mz\\OneDrive - BP\\Java_ML_Pipeline\\java-datapipeline-platform\\src\\test\\java\\io\\javaml\\datapipeline\\java_datapipeline_platform\\requirements.txt");
            System.out.println("Dependencies installation exit code: " + installExitCode);

            // Step 3: Run a test Python script.
            // Ensure you have a test_script.py that prints a message.
            String testScriptPath = "C:\\Users\\7270mz\\OneDrive - BP\\Java_ML_Pipeline\\java-datapipeline-platform\\src\\test\\java\\io\\javaml\\datapipeline\\java_datapipeline_platform\\test.py";  // Adjust the path as needed.
            List<String> scriptArgs = new ArrayList<>();  // No additional arguments for this test.
            int runScriptExitCode = runner.runScript(testScriptPath, scriptArgs);
            System.out.println("Script execution exit code: " + runScriptExitCode);
            
            
            int deleteEnvCode = runner.deleteVirtualEnv();
            System.out.println("Virtual Environment deletion exit code: " + deleteEnvCode);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
