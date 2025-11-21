package com.cit.thesis.service;

import com.cit.thesis.model.AuditLog;
import com.cit.thesis.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void log(Long userId, String userEmail, String action,
            String entityType, Long entityId, String details, String ipAddress) {
        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setUserEmail(userEmail);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        log.setIpAddress(ipAddress);

        auditLogRepository.save(log);
    }

    @Transactional
    public void log(String userEmail, String action, String details) {
        log(null, userEmail, action, null, null, details, null);
    }
}