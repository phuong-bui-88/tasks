package com.tasks.util;

import com.tasks.model.User;
import com.tasks.repository.UserRepository;
import com.tasks.service.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.JwtException;

import java.util.Optional;
import java.util.List;

/**
 * Utility class for security operations
 * 
 * JWT Authentication Flow:
 * 1. Client sends a request with JWT in Authorization header
 * 2. JwtAuthenticationFilter intercepts the request
 * 3. Filter validates the JWT using JwtService
 * 4. If valid, it creates an Authentication object with user details from JWT
 * 5. This Authentication is stored in SecurityContextHolder
 * 6. Controllers can then access the user via SecurityContextHolder
 * 
 * The getCurrentUser methods use SecurityContextHolder (not direct JWT parsing)
 * because the JWT has already been validated and converted to an Authentication object.
 * 
 * The JWT-specific methods (getUserFromJwt, getUsernameFromJwt) are typically used
 * in filters or when you need to manually validate a token outside the standard flow.
 */
public class SecurityUtils {

    /**
     * Get the current authenticated user from the security context
     * 
     * @param userRepository Repository to fetch the user entity
     * @return Optional containing the user if authenticated, empty otherwise
     */
    public static Optional<User> getCurrentUser(UserRepository userRepository) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        
        Object principal = authentication.getPrincipal();
        String username;
        
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        
        return userRepository.findByUsername(username);
    }
    
    /**
     * Get the username of the current authenticated user
     * 
     * @return Optional containing the username if authenticated, empty otherwise
     */
    public static Optional<String> getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof UserDetails) {
            return Optional.of(((UserDetails) principal).getUsername());
        } else {
            return Optional.of(principal.toString());
        }
    }

    /**
     * Extract user from JWT token
     *
     * @param token JWT token string
     * @param userRepository Repository to fetch the user entity
     * @param secretKey JWT secret key for verification
     * @return Optional containing the user if found, empty otherwise
     */
    public static Optional<User> getUserFromJwt(String token, UserRepository userRepository, String secretKey) {
        Optional<String> username = getUsernameFromJwt(token, secretKey);
        return username.flatMap(userRepository::findByUsername);
    }
    
    /**
     * Extract username from JWT token
     *
     * @param token JWT token string
     * @param secretKey JWT secret key for verification
     * @return Optional containing the username if extraction successful, empty otherwise
     */
    public static Optional<String> getUsernameFromJwt(String token, String secretKey) {
        try {
            // Remove "Bearer " prefix if present
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
            
            return Optional.ofNullable(claims.getSubject());
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    /**
     * Extract user from JWT token using the application's JwtService
     *
     * @param token JWT token string
     * @param userRepository Repository to fetch the user entity
     * @param jwtService Application's JWT service for token handling
     * @return Optional containing the user if found, empty otherwise
     */
    public static Optional<User> getUserFromJwtWithService(String token, UserRepository userRepository, JwtService jwtService) {
        try {
            // Remove "Bearer " prefix if present
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            
            String username = jwtService.extractUsername(token);
            if (username != null) {
                return userRepository.findByUsername(username);
            }
            return Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Extract JWT token from HTTP request headers
     *
     * @param headers The HTTP headers containing the Authorization header
     * @return Optional containing the JWT token if present, empty otherwise
     */
    public static Optional<String> getJwtFromHeaders(HttpHeaders headers) {
        List<String> authHeaders = headers.get(HttpHeaders.AUTHORIZATION);
        if (authHeaders != null && !authHeaders.isEmpty()) {
            String bearerToken = authHeaders.get(0);
            if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
                return Optional.of(bearerToken.substring(7));
            }
        }
        return Optional.empty();
    }

    /**
     * Get user from HTTP headers' JWT token
     *
     * @param headers The HTTP headers containing the Authorization header
     * @param userRepository Repository to fetch the user entity
     * @param jwtService JWT service for token validation and extraction
     * @return Optional containing the user if found and token valid, empty otherwise
     */
    public static Optional<User> getUserFromHeaders(HttpHeaders headers,
                                                   UserRepository userRepository,
                                                   JwtService jwtService) {
        return getJwtFromHeaders(headers)
               .flatMap(token -> getUserFromJwtWithService(token, userRepository, jwtService));
    }
    
    /**
     * Extract JWT token from request
     *
     * @param request The server HTTP request
     * @return Optional containing the JWT token if present, empty otherwise
     */
    public static Optional<String> getJwtFromRequest(ServerHttpRequest request) {
        return getJwtFromHeaders(request.getHeaders());
    }
    
    /**
     * Get user from request's JWT token
     *
     * @param request The server HTTP request
     * @param userRepository Repository to fetch the user entity
     * @param jwtService JWT service for token validation and extraction
     * @return Optional containing the user if found and token valid, empty otherwise
     */
    public static Optional<User> getUserFromRequest(ServerHttpRequest request,
                                                  UserRepository userRepository,
                                                  JwtService jwtService) {
        return getJwtFromRequest(request)
               .flatMap(token -> getUserFromJwtWithService(token, userRepository, jwtService));
    }
}
