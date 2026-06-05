package ch.evers.martin.smarttask.repository;

import ch.evers.martin.smarttask.entity.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PriorityRepository extends JpaRepository<Priority, Long> {
    List<Priority> findByUserId(Long userId);
    Optional<Priority> findByUserIdAndLevelIgnoreCase(Long userId, String level);
}

