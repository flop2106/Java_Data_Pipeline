package io.javaml.datapipeline.java_datapipeline_platform.database;

import io.javaml.datapipeline.java_datapipeline_platform.utils.CSVFileSelector;
import io.javaml.datapipeline.java_datapipeline_platform.utils.*;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class CSVDatabase extends Database {
    private String dbPath;
    private List<String[]> data;
    private Map<String, String> config;

    public CSVDatabase(String dbType, Map<String, String> config) {
        super();
        this.config = config;
    }

    @Override
    public List<String[]> read() {
        // For interactive mode, use file chooser:
        File csvFile = CSVFileSelector.SelectCSVFile();
        if (csvFile != null) {
            this.dbPath = csvFile.getAbsolutePath();
        } else {
            throw new IllegalStateException("No CSV file selected");
        }
        return CSVFileSelector.parseCSV(new File(this.dbPath));
    }

    // Interactive configuration: uses file chooser to load CSV and sets data.
    public void config() {
        this.data = read();
        LogBuffer.addLog("CSV Database configured interactively with path: " + this.dbPath);
    }

    // API configuration: sets CSV path from provided config map.
    @Override
    public void configureApi() {
        String path = this.config.get("csvPath");
        if (path == null || path.trim().isEmpty()) {
            throw new IllegalArgumentException("csvPath is required in the configuration.");
        }
        this.dbPath = path;
        this.data = CSVFileSelector.parseCSV(new File(this.dbPath));
        LogBuffer.addLog("CSV Database configured via API with path: " + this.dbPath);
    }

    @Override
    public void write() throws IOException {
        CSVUtils.writeListToTempCSV(this.data);
        LogBuffer.addLog("Successfully wrote CSV data to temporary file.");
    }

    @Override
    public void connect() {
        File file = new File(dbPath);
        if (file.exists()) {
            LogBuffer.addLog("Connected to CSV file at: " + dbPath);
        } else {
            LogBuffer.addLog("CSV file does not exist at: " + dbPath);
        }
    }

    @Override
    public List<String[]> getData() {
        return this.data;
    }

    @Override
    public String getName() {
        return "CSV Database";
    }

    // Here we implement the API version of execution.
    // The folderPath can be used to override or confirm the file location.
    @Override
    public void execute() {
        String folderPath = this.config.get("csvPath");
        // Optionally update dbPath if folderPath is provided.
        if (folderPath != null && !folderPath.trim().isEmpty()) {
            this.dbPath = folderPath;
        }
        // Now execute the steps non-interactively.
        connect();
        try {
            write();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
