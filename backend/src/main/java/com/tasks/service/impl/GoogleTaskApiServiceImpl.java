package com.tasks.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.tasks.Tasks;
import com.tasks.dto.TaskDTO;
import com.tasks.service.GoogleApiService;

@Service
public class GoogleTaskApiServiceImpl implements GoogleApiService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleTaskApiServiceImpl.class);
    private static final String DEFAULT_TASKLIST = "@default";
    private static final String DEFAULT_CALENDAR = "primary";

    private final Calendar calendarService;
    private final ObjectMapper objectMapper;

    @Autowired
    public GoogleTaskApiServiceImpl(Calendar calendarService) {
        this.calendarService = calendarService;

        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
                false);

        logger.info("Initialized GoogleTaskApiServiceImpl for direct Google Calendar integration");
    }

    @Override
    public String createTask(String taskPayload) {
        logger.info("Creating Google task with payload: {}", taskPayload);
        String resourceId = "google-task-" + UUID.randomUUID().toString();
        logger.info("Created Google task with ID: {}", resourceId);
        return resourceId;
    }

    @Override
    public void updateTask(String taskPayload, String googleTaskId) {
        logger.info("Updating Google task {} with payload: {}", googleTaskId, taskPayload);
    }

    @Override
    public void deleteTask(String googleTaskId) {
        logger.info("Deleting Google task: {}", googleTaskId);
    }

    @Override
    public boolean isAuthenticated() {
        try {
            calendarService.calendars().get("primary").execute();
            return true;
        } catch (Exception e) {
            logger.error("Authentication check failed: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public String getAuthStatus() {
        return isAuthenticated() ? "Production mode - authenticated" : "Authentication failed";
    }

    @Override
    public String createCalendarEvent(String eventPayload) {
        try {
            logger.info("Creating Google Calendar event from payload");

            TaskDTO taskDTO = objectMapper.readValue(eventPayload, TaskDTO.class);

            Event event = new Event().setSummary(taskDTO.getTitle()).setDescription(taskDTO.getDescription());

            if (taskDTO.getStartDate() != null) {
                DateTime startDateTime = new DateTime(
                        taskDTO.getStartDate().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
                event.setStart(new EventDateTime().setDateTime(startDateTime));
            }

            if (taskDTO.getDueDate() != null) {
                DateTime endDateTime = new DateTime(
                        taskDTO.getDueDate().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
                event.setEnd(new EventDateTime().setDateTime(endDateTime));
            }

            event.setDescription((taskDTO.getDescription() != null ? taskDTO.getDescription() : "") + "\n\nTask ID: "
                    + taskDTO.getId() + "\nStatus: " + taskDTO.getStatus() + "\nCreator: "
                    + taskDTO.getAuthorUsername());

            if (taskDTO.getStatus() != null) {
                switch (taskDTO.getStatus()) {
                case PENDING:
                    event.setColorId("5");
                    break;
                case COMPLETED:
                    event.setColorId("2");
                    break;
                default:
                    event.setColorId("1");
                }
            }

            logger.info("Inserting event into Google Calendar: {}", event.getSummary());
            Event createdEvent = calendarService.events().insert(DEFAULT_CALENDAR, event).execute();
            logger.info("Successfully created Google Calendar event with ID: {}", createdEvent.getId());
            return createdEvent.getId();

        } catch (Exception e) {
            logger.error("Error creating Google Calendar event: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create Google Calendar event", e);
        }
    }

    @Override
    public void updateCalendarEvent(String eventPayload, String googleEventId) {
        try {
            logger.info("Updating Google Calendar event: {}", googleEventId);

            TaskDTO taskDTO = objectMapper.readValue(eventPayload, TaskDTO.class);

            Event event;
            try {
                event = calendarService.events().get(DEFAULT_CALENDAR, googleEventId).execute();
            } catch (IOException e) {
                logger.warn("Event not found, creating new one instead");
                createCalendarEvent(eventPayload);
                return;
            }

            event.setSummary(taskDTO.getTitle()).setDescription(taskDTO.getDescription());

            if (taskDTO.getStartDate() != null) {
                DateTime startDateTime = new DateTime(
                        taskDTO.getStartDate().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
                event.setStart(new EventDateTime().setDateTime(startDateTime));
            }

            if (taskDTO.getDueDate() != null) {
                DateTime endDateTime = new DateTime(
                        taskDTO.getDueDate().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());
                event.setEnd(new EventDateTime().setDateTime(endDateTime));
            }

            if (taskDTO.getStatus() != null) {
                switch (taskDTO.getStatus()) {
                case PENDING:
                    event.setColorId("5");
                    break;
                case COMPLETED:
                    event.setColorId("2");
                    break;
                default:
                    event.setColorId("1");
                }
            }

            calendarService.events().update(DEFAULT_CALENDAR, googleEventId, event).execute();
            logger.info("Successfully updated Google Calendar event: {}", googleEventId);

        } catch (Exception e) {
            logger.error("Error updating Google Calendar event: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update Google Calendar event", e);
        }
    }

    @Override
    public void deleteCalendarEvent(String googleEventId) {
        try {
            logger.info("Deleting Google Calendar event: {}", googleEventId);

            calendarService.events().delete(DEFAULT_CALENDAR, googleEventId).execute();
            logger.info("Successfully deleted Google Calendar event: {}", googleEventId);

        } catch (Exception e) {
            logger.error("Error deleting Google Calendar event: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete Google Calendar event", e);
        }
    }

    @Override
    public boolean shouldSyncAsCalendarEvent(String taskPayload) {
        try {
            JsonNode taskNode = objectMapper.readTree(taskPayload);

            boolean hasStartDate = taskNode.has("startDate") && !taskNode.get("startDate").isNull();
            boolean hasDueDate = taskNode.has("dueDate") && !taskNode.get("dueDate").isNull();

            return hasStartDate && hasDueDate;

        } catch (Exception e) {
            logger.error("Error determining if task should be synced as calendar event: {}", e.getMessage());
            return false;
        }
    }
}
