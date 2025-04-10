package io.javaml.datapipeline.java_datapipeline_platform.utils;

import java.util.ArrayList;
import java.util.List;
public class LogBuffer {
    private static final List<String> logs = new ArrayList<>();

    public static synchronized void addLog(String line){
        logs.add(line);
    }

    public static synchronized List<String> getLogs(){
        return new ArrayList<>(logs);
    }
}
