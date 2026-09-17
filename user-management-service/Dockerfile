# Stage 1: Build JAR using Maven
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml ./
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime Image with minimal JRE (Multi-architecture)
FROM eclipse-temurin:17-jre
WORKDIR /app

# Run as non-root user for enterprise Kubernetes security compliance
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
USER appuser

COPY --from=builder /app/target/user-management-service-*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
