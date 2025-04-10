package io.javaml.datapipeline.java_datapipeline_platform.utils;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

public class CSVUtils {
    public static String writeListToTempCSV(List<String[]> csvLines) throws IOException {
        String tempFilePath = System.getProperty("user.dir") + "\\src\\main\\resources\\static\\temp.csv";
        try (FileWriter writer = new FileWriter(tempFilePath)) {
            for (String[] row : csvLines) {
                String line = String.join(",", row);
                writer.write(line);
                writer.write(System.lineSeparator());
            }
        }
        return tempFilePath;
    }
}
