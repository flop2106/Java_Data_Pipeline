package io.javaml.datapipeline.java_datapipeline_platform.utils;
import com.opencsv.CSVReader;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;
import java.io.File;
import java.io.FileReader;
import java.util.List;

public class CSVFileSelector {
    public static File SelectCSVFile(){
        try{
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (UnsupportedLookAndFeelException | ClassNotFoundException
        | InstantiationException | IllegalAccessException e){
            e.printStackTrace();
        }

        JFrame frame = new JFrame();
        frame.setAlwaysOnTop(true);
        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Select CSV File");
        int result = fileChooser.showOpenDialog(frame);
        frame.dispose();
        if (result == JFileChooser.APPROVE_OPTION){
            File selectedFile = fileChooser.getSelectedFile();
            LogBuffer.addLog("Selected file: " + selectedFile.getAbsolutePath());
            return selectedFile;
        } else {
            LogBuffer.addLog("No file selected. File Selection Cancelled.");
            return null;
        }
    }

    public static List<String[]> parseCSV(File csvFile){
        try (CSVReader reader = new CSVReader(new FileReader(csvFile))){
            List<String[]> records = reader.readAll();
            //for (String[] record: records){
            //    for (String field: record){
            //        LogBuffer.addLog(field + " ");
            //    }
            //    LogBuffer.addLog();
            //}
            return records;
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
