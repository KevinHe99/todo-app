FROM openjdk:21

WORKDIR /app

VOLUME /tmp

COPY target/*jar /app/todo-0.0.2-SNAPSHOT.jar

EXPOSE 8120

ENTRYPOINT ["java", "-jar", "/app/todo-0.0.2-SNAPSHOT.jar"]