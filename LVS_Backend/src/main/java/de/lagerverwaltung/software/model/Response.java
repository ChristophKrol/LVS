package de.lagerverwaltung.software.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;


/**
 * HTTP-Response Object -Definition
 */
@Data
@SuperBuilder
@NoArgsConstructor
@JsonInclude(NON_NULL) // Response successfull -> reason, developerMessage = null => Do not include
public class Response {
    protected LocalDateTime timestamp;
    /**
     * HTTP-Status-Code
     */
    protected int statusCode;
    /**
     * Status-Object
     */
    protected HttpStatus status;
    /**
     * Error-Cause
     */
    protected String reason;
    /**
     * User Message
     */
    protected String message;
    /**
     * Dev Message
     */
    protected String developerMessage;
    protected Map<?, ?> data;
}
