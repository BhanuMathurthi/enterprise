package com.enterprise.usermanagement.repository;

import com.enterprise.usermanagement.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByExternalIdentityId(String externalIdentityId);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
