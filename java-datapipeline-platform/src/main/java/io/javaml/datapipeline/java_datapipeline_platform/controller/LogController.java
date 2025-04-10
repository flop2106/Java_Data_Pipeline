package io.javaml.datapipeline.java_datapipeline_platform.controller;

import io.javaml.datapipeline.java_datapipeline_platform.utils.LogBuffer;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000") //enable CORS between 2 port
public class LogController {
    @GetMapping("/api/logs")
    public List<String> getLogs(){
        return LogBuffer.getLogs();
    }
    
}
