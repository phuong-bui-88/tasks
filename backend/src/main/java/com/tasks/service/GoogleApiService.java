package com.tasks.service;

/**
 * Service interface for interacting with Google APIs
 */
public interface GoogleApiService {

    /**
     * Create a task in Google API
     * 
     * @param taskPayload JSON representation of task
     * @return Google resource ID of created task
     */
    String createTask(String taskPayload);

    /**
     * Update a task in Google API
     * 
     * @param taskPayload  JSON representation of task
     * @param googleTaskId ID of Google task to update
     */
    void updateTask(String taskPayload, String googleTaskId);

    /**
     * Delete a task from Google API
     * 
     * @param googleTaskId ID of Google task to delete
     */
    void deleteTask(String googleTaskId);

    /**
     * Check if authenticated with Google API
     * 
     * @return true if authenticated, false otherwise
     */
    boolean isAuthenticated();

    /**
     * Get authentication status
     * 
     * @return Description of authentication status
     */
    String getAuthStatus();

    /**
     * Create a calendar event in Google Calendar
     * 
     * @param eventPayload JSON representation of event
     * @return Google resource ID of created event
     */
    String createCalendarEvent(String eventPayload);

    /**
     * Update a calendar event in Google Calendar
     * 
     * @param eventPayload  JSON representation of event
     * @param googleEventId ID of Google event to update
     */
    void updateCalendarEvent(String eventPayload, String googleEventId);

    /**
     * Delete a calendar event from Google Calendar
     * 
     * @param googleEventId ID of Google event to delete
     */
    void deleteCalendarEvent(String googleEventId);

    /**
     * Check if task should be synced as calendar event
     * 
     * @param taskPayload JSON representation of task
     * @return true if task should be synced as calendar event
     */
    boolean shouldSyncAsCalendarEvent(String taskPayload);
}
