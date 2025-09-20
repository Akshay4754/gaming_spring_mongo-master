package com.gamezone.ecomsystem.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.gamezone.ecomsystem.model.Admin;

public interface AdminRepository extends MongoRepository<Admin, String> {
    Optional<Admin> findByUsername(String username);
    Optional<Admin> findByEmail(String email);
    Optional<Admin> findByUsernameAndIsActive(String username, boolean isActive);
}
