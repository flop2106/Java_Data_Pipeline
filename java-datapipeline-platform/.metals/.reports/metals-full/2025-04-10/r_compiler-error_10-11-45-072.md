file:///C:/Users/7270mz/OneDrive%20-%20BP/Java_ML_Pipeline/java-datapipeline-platform/src/main/java/io/javaml/datapipeline/java_datapipeline_platform/ml/LSTMModel.java
### java.util.NoSuchElementException: next on empty iterator

occurred in the presentation compiler.

presentation compiler configuration:


action parameters:
uri: file:///C:/Users/7270mz/OneDrive%20-%20BP/Java_ML_Pipeline/java-datapipeline-platform/src/main/java/io/javaml/datapipeline/java_datapipeline_platform/ml/LSTMModel.java
text:
```scala
package io.javaml.datapipeline.java_datapipeline_platform.ml;

import io.javaml.datapipeline.java_datapipeline_platform.utils.*;
import io.javaml.datapipeline.java_datapipeline_platform.pipeline.PipelineStep;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class LSTMModel extends MLModel {
    private List<String> args;
    private DynamicPythonRunner runner;
    private Scanner scanner;
    private String currentDir;
    Map<String, String> config;
    private Map<String, String> parameters;
    String mlType;
    // No-argument constructor for API use; interactive configuration uses Scanner.
    public LSTMModel(String mlType, Map<String, String> config, DynamicPythonRunner runner){
        super();
        this.config = config;
        this.runner = runner;
        this.args = new ArrayList<>();
        // For interactive use; for API calls, configuration will be provided via configureApi.
        this.scanner = new Scanner(System.in);
        this.currentDir = System.getProperty("user.dir");
    }
    
    // Interactive configuration (using console input)
    @Override
    public void configure(){
        args.clear();
        LogBuffer.addLog("Configure LSTM Model (Interactive): ");
        System.out.print("Enter train/test ratio (e.g., 0.7): ");
        String trainRatio = scanner.nextLine();

        System.out.print("Enter Features (comma-separated; e.g., open,high,low): ");
        String features = scanner.nextLine();

        System.out.print("Enter Target (e.g., close): ");
        String target = scanner.nextLine();

        System.out.print("Enable Seasonality? (true/false): ");
        String seasonality = scanner.nextLine();

        args.add("--train_ratio=" + trainRatio);
        args.add("--features=" + features);
        args.add("--target=" + target);
        args.add("--seasonality=" + seasonality);
    }
    
    // API configuration: parameters provided via a Map (from a JSON payload, for example)
    public void configureApi(Map<String, String> parameters) {
        args.clear();
        this.parameters = parameters;
        if (parameters != null){
            parameters.forEach((key, value) ->{
                args.add("--"+key+"="+value);
            });
        }
    }
    
    // Interactive execution: prompts for folder path and re-run option.
    @Override
    public void execute(){
        try{
            LogBuffer.addLog("Using default folder path for LSTM (interactive):");
            String path = "\\src\\main\\java\\io\\javaml\\datapipeline\\java_datapipeline_platform\\python";
            
            int envExitCode = runner.createVirtualEnv();
            LogBuffer.addLog("Virtual environment creation exit code: " + envExitCode);
            int installExitCode = runner.installDependencies(currentDir + path + "\\requirements.txt");
            LogBuffer.addLog("Dependencies installation exit code: " + installExitCode);
            String continueExecute = "true";
            while (continueExecute.equals("true")){
                    // Optionally prompt again for configuration if desired.
                    configure();
                    int runScriptExitCode = runner.runScript(currentDir + path + "\\lstm.py", args);
                    LogBuffer.addLog("Script execution exit code: " + runScriptExitCode);
                    System.out.print("Do you want to rerun this ML LSTM Script? (true, false): ");
                    continueExecute = scanner.nextLine();
            }
            int deleteEnvCode = runner.deleteVirtualEnv();
            LogBuffer.addLog("Virtual Environment deletion exit code: " + deleteEnvCode);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
    
    // API execution: uses previously configured parameters (via configureApi) and a given folder path.
    @Override
    public void executeAPI() {
        try {
            int runScriptExitCode = runner.runScript(this.config.get("scriptPath"), args);
            LogBuffer.addLog("Script execution exit code: " + runScriptExitCode);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
    
    @Override
    public String getName(){
        return "LSTM Model";
    }
    
    @Override
    public void visualize(){
        // Visualization logic can be implemented here (e.g., generating plots)
    }
}

```



#### Error stacktrace:

```
scala.collection.Iterator$$anon$19.next(Iterator.scala:973)
	scala.collection.Iterator$$anon$19.next(Iterator.scala:971)
	scala.collection.mutable.MutationTracker$CheckedIterator.next(MutationTracker.scala:76)
	scala.collection.IterableOps.head(Iterable.scala:222)
	scala.collection.IterableOps.head$(Iterable.scala:222)
	scala.collection.AbstractIterable.head(Iterable.scala:935)
	dotty.tools.dotc.interactive.InteractiveDriver.run(InteractiveDriver.scala:164)
	dotty.tools.pc.CachingDriver.run(CachingDriver.scala:45)
	dotty.tools.pc.WithCompilationUnit.<init>(WithCompilationUnit.scala:31)
	dotty.tools.pc.SimpleCollector.<init>(PcCollector.scala:351)
	dotty.tools.pc.PcSemanticTokensProvider$Collector$.<init>(PcSemanticTokensProvider.scala:63)
	dotty.tools.pc.PcSemanticTokensProvider.Collector$lzyINIT1(PcSemanticTokensProvider.scala:63)
	dotty.tools.pc.PcSemanticTokensProvider.Collector(PcSemanticTokensProvider.scala:63)
	dotty.tools.pc.PcSemanticTokensProvider.provide(PcSemanticTokensProvider.scala:88)
	dotty.tools.pc.ScalaPresentationCompiler.semanticTokens$$anonfun$1(ScalaPresentationCompiler.scala:111)
```
#### Short summary: 

java.util.NoSuchElementException: next on empty iterator