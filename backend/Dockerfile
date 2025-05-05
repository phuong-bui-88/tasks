# --- Development image for Dev Container ---
FROM mcr.microsoft.com/devcontainers/java:1-21 AS dev

# Copy pom.xml and download dependencies (for faster dev builds)
COPY pom.xml .
# RUN mvn dependency:go-offline

# Copy source code (for dev container, this will be overridden by a bind mount)
COPY src src

# Expose default Spring Boot port and debug port
EXPOSE 8080 5005

# Set environment for development
ENV JAVA_OPTS="-XX:+UseG1GC -Xms256m -Xmx512m"
ENV MAVEN_OPTS=""

# Default command for dev container (keep container alive)
CMD ["sleep", "infinity"]
