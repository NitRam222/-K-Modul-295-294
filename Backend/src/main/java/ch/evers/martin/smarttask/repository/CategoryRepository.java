package ch.evers.martin.smarttask.repository;

import ch.evers.martin.smarttask.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);
    Optional<Category> findByUserIdAndNameIgnoreCase(Long userId, String name);
}

