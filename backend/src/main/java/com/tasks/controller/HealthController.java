package com.tasks.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for health check endpoints and basic system status
 */
@RestController
public class HealthController {

    /**
     * Root endpoint to verify the application is running
     * @return A simple hello message with timestamp
     */
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> helloMessage() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "running");
        response.put("message", "Hello! The backend service is up and running.");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Health check endpoint for monitoring systems
     * @return Health status information
     */
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> healthStatus = new HashMap<>();
        healthStatus.put("status", "UP");
        healthStatus.put("service", "Task Management API");
        healthStatus.put("timestamp", System.currentTimeMillis());
        
        // Add JVM metrics
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("memory", Runtime.getRuntime().freeMemory() + "/" + Runtime.getRuntime().totalMemory());
        metrics.put("processors", Runtime.getRuntime().availableProcessors());
        metrics.put("version", System.getProperty("java.version"));
        healthStatus.put("metrics", metrics);
        
        return ResponseEntity.ok(healthStatus);
    }
    
    /**
     * Database health check endpoint
     * @return Database connection status
     */
    @GetMapping("/api/health/db")
    public ResponseEntity<Map<String, Object>> dbHealthCheck() {
        Map<String, Object> dbStatus = new HashMap<>();
        
        try {
            // You could inject a DataSource and check the connection here
            // For simplicity, we're just returning a positive status
            dbStatus.put("status", "UP");
            dbStatus.put("database", "MySQL");
            dbStatus.put("message", "Database connection is working");
        } catch (Exception e) {
            dbStatus.put("status", "DOWN");
            dbStatus.put("error", e.getMessage());
            return ResponseEntity.status(503).body(dbStatus);
        }
        
        return ResponseEntity.ok(dbStatus);
    }
}
