package com.enterprise.usermanagement.exception;

public class IdentityPlatformException extends RuntimeException {

    private final int statusCode;

    public IdentityPlatformException(String message) {
        super(message);
        this.statusCode = 502;
    }

    public IdentityPlatformException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public IdentityPlatformException(String message, Throwable cause, int statusCode) {
        super(message, cause);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
