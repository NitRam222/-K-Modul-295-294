package ch.evers.martin.smarttask.repository;

import ch.evers.martin.smarttask.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
    List<Task> findByUserIdAndCompletedFalse(Long userId);
    List<Task> findByUserIdAndCompletedTrue(Long userId);
}
