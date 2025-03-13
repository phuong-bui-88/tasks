package com.tasks.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.tasks.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            // Get Authorization header
            String authHeader = request.getHeader("Authorization");
            
            // Check if header exists and has Bearer token
            if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
                // Extract token (remove "Bearer " prefix)
                String jwt = authHeader.substring(7);
                
                try {
                    // Extract username from token
                    String username = jwtService.extractUsername(jwt);
                    logger.debug("JWT token processing for user: " + username);
                    
                    // If username exists
                    if (StringUtils.hasText(username)) {
                        // Load user details
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        
                        // Validate token
                        if (jwtService.validateToken(jwt, userDetails)) {
                            // Create authentication token
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                            
                            // Set authentication details
                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            
                            // Set authentication in context
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                            logger.debug("Successfully authenticated user: " + username);
                        } else {
                            logger.warn("Token validation failed for user: " + username);
                        }
                    }
                } catch (Exception e) {
                    logger.error("JWT validation error: " + e.getMessage(), e);
                }
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }
        
        filterChain.doFilter(request, response);
    }
}
