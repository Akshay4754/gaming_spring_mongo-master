package com.gamezone.ecomsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.gamezone.ecomsystem.model.Admin;
import com.gamezone.ecomsystem.repository.AdminRepository;
import com.gamezone.ecomsystem.exception.ResourceNotFoundException;
import com.gamezone.ecomsystem.exception.BusinessException;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Admin create(Admin admin) {
        // Check if username already exists
        if (adminRepository.findByUsername(admin.getUsername()).isPresent()) {
            throw new BusinessException("Username already exists");
        }
        
        // Check if email already exists
        if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
            throw new BusinessException("Email already exists");
        }
        
        return adminRepository.save(admin);
    }

    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    public Admin findById(String id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));
    }

    public Admin findByUsername(String username) {
        return adminRepository.findByUsernameAndIsActive(username, true)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with username: " + username));
    }

    public Admin update(String id, Admin adminDetails) {
        Admin existingAdmin = findById(id);
        
        existingAdmin.setUsername(adminDetails.getUsername());
        existingAdmin.setEmail(adminDetails.getEmail());
        existingAdmin.setFullName(adminDetails.getFullName());
        
        return adminRepository.save(existingAdmin);
    }

    public void delete(String id) {
        if (!adminRepository.existsById(id)) {
            throw new ResourceNotFoundException("Admin not found with id: " + id);
        }
        adminRepository.deleteById(id);
    }

    public boolean authenticate(String username) {
        return adminRepository.findByUsernameAndIsActive(username, true).isPresent();
    }
}
