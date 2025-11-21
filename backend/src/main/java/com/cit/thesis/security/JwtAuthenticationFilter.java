package com.cit.thesis.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");
            System.out.println(
                    "🔍 Step 1: authHeader = " + (authHeader != null ? authHeader.substring(0, 20) + "..." : "null"));

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                System.out.println("🔍 Step 2: token extracted");

                String email = jwtUtil.extractEmail(token);
                System.out.println("🔍 Step 3: email = " + email);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    System.out.println("🔍 Step 4: validating token...");
                    if (jwtUtil.validateToken(token, email)) {
                        System.out.println("🔍 Step 5: token valid");
                        String role = jwtUtil.extractRole(token);
                        System.out.println("🔍 Step 6: role = " + role);

                        // Add debug logging
                        System.out.println("🔍 Creating authority with role: " + role);
                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);
                        System.out.println("🔍 Authority created: " + authority.getAuthority());

                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                role != null ? Collections.singletonList(authority)
                                        : Collections.emptyList());

                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println(
                                "✅ Step 7: Authentication set! Authorities: " + authentication.getAuthorities());
                    } else {
                        System.out.println("❌ Token validation failed!");
                    }
                } else {
                    System.out.println("⚠️ Email is null or authentication already exists");
                }
            } else {
                System.out.println("⚠️ No Bearer token found in request to: " + request.getRequestURI());
            }
        } catch (Exception e) {
            System.err.println("❌ JWT FILTER ERROR: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("🔍 Step 8: Calling filterChain.doFilter()");
        filterChain.doFilter(request, response);
    }
}