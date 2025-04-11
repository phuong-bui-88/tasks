# Use Maven image for building
FROM maven:3.8-eclipse-temurin-17 as build
WORKDIR /workspace/app

# Copy pom.xml and source code
COPY pom.xml .
COPY src src

# Build the application
RUN mvn package -DskipTests

# Create a slim runtime image
FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
COPY --from=build /workspace/app/target/*.jar app.jar

# Add debug options and configure JVM
ENV JAVA_OPTS="-XX:+UseG1GC -Xms512m -Xmx1024m"
ENV DEBUG_OPTS=""

# Run with proper options
ENTRYPOINT java $JAVA_OPTS $DEBUG_OPTS -jar /app.jar
