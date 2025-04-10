package io.javaml.datapipeline.java_datapipeline_platform.database;

import io.javaml.datapipeline.java_datapipeline_platform.pipeline.PipelineStep;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Abstract class representing a database step in the pipeline.
 * Concrete implementations (e.g. CSVDatabase) must provide implementations
 * for reading, writing, connecting, and retrieving data.
 */
public abstract class Database implements PipelineStep{
    protected String dbType;
    Map<String, String> config;
    
    public Database() {
    }
    
    /**
     * Factory method to create a Database instance.
     * Currently, only CSV databases are supported.
     * 
     * @param dbType the type of database ("csv" expected)
     * @return a new Database instance (e.g., CSVDatabase)
     */
    public static Database createDatabase(String dbType, Map<String, String> config) {
        if ("csv".equalsIgnoreCase(dbType)) {
            return new CSVDatabase(dbType, config);
        } else {
            throw new IllegalArgumentException("Invalid Database Type: " + dbType);
        }
    }
    
    public abstract List<String[]> read();
    public abstract void write() throws IOException;
    public abstract void connect();
    public abstract List<String[]> getData();
    public abstract void configureApi();


    /**
     * The default execute() method: connect to the database and write data.
     */
    @Override
    public void execute() {
        connect();
        try {
            write();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
