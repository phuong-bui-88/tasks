package com.tasks.config;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;

@Configuration
public class GoogleApiConfig {

        private static final Logger logger = LoggerFactory.getLogger(GoogleApiConfig.class);
        private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
        private static final String TOKENS_DIRECTORY_PATH = "tokens";

        // If modifying these scopes, delete your previously saved tokens/ folder.
        private static final List<String> SCOPES = Collections.singletonList(CalendarScopes.CALENDAR);
        private static final String CREDENTIALS_FILE_PATH = "credentials.json";

        @Value("${google.api.application-name:Task Manager}")
        private String applicationName;

        @Bean
        public Calendar calendarService() throws IOException, GeneralSecurityException {
                try {
                        logger.info("Initializing Google Calendar API client");

                        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

                        // Load client secrets.
                        InputStream in = GoogleApiConfig.class.getResourceAsStream("/" + CREDENTIALS_FILE_PATH);
                        if (in == null) {
                                logger.error("Resource not found: {}", CREDENTIALS_FILE_PATH);
                                throw new FileNotFoundException("Resource not found: " + CREDENTIALS_FILE_PATH);
                        }

                        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY,
                                        new InputStreamReader(in));

                        // Build flow and trigger user authorization request.
                        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(HTTP_TRANSPORT,
                                        JSON_FACTORY, clientSecrets, SCOPES)
                                                        .setDataStoreFactory(new FileDataStoreFactory(
                                                                        new java.io.File(TOKENS_DIRECTORY_PATH)))
                                                        .setAccessType("offline").build();

                        // Update the receiver configuration to match the exact callback path Google is
                        // using
                        logger.info("Setting up local server receiver for authorization");
                        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
                        logger.info("Local server receiver configured on port 9080");
                        Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
                        logger.info("Successfully authorized Google Calendar API client");
                        logger.info("Access Token: {}", credential.getAccessToken());
                        logger.info("Refresh Token: {}", credential.getRefreshToken());
                        logger.info("Token Expiration Time: {}", credential.getExpirationTimeMilliseconds());

                        Calendar service = new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                                        .setApplicationName(applicationName).build();

                        logger.info("Successfully initialized Google Calendar API client");
                        return service;

                } catch (Exception e) {
                        logger.error("Failed to initialize Google Calendar API client: {}", e.getMessage(), e);

                        // Create a fallback service with no authentication for development mode
                        logger.warn("Creating fallback Google Calendar service without authentication");
                        NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
                        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, request -> {
                        }).setApplicationName(applicationName).build();
                }
        }

}
