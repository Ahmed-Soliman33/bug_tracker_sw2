FROM openjdk:21

WORKDIR /app

COPY target/Bug-Service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java","-jar","app.jar"]