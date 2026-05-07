package com.taskmanager.repository;

import com.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// JpaRepository<Entity, PrimaryKeyType> gives us save(), findById(), findAll(), delete() for free
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
