FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
EXPOSE 5005
ENV JAVA_TOOL_OPTIONS "-agentlib:jdwp=transport=dt_socket,address=*:5005,server=y,suspend=n"
ENTRYPOINT ["java", "-jar", "app.jar"]
