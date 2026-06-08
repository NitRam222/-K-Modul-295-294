package ch.evers.martin.smarttask.service;

import ch.evers.martin.smarttask.entity.Category;
import ch.evers.martin.smarttask.entity.Priority;
import ch.evers.martin.smarttask.entity.User;
import ch.evers.martin.smarttask.repository.CategoryRepository;
import ch.evers.martin.smarttask.repository.PriorityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DefaultDataService {

    private final CategoryRepository categoryRepository;
    private final PriorityRepository priorityRepository;

    public DefaultDataService(CategoryRepository categoryRepository, PriorityRepository priorityRepository) {
        this.categoryRepository = categoryRepository;
        this.priorityRepository = priorityRepository;
    }

    @Transactional
    public void createDefaultsForUser(User user) {
        if (user == null || user.getId() == null) {
            return;
        }

        createDefaultPriority(user, "LOW");
        createDefaultPriority(user, "MEDIUM");
        createDefaultPriority(user, "HIGH");

        createDefaultCategory(user, "Arbeit");
        createDefaultCategory(user, "Allgemein");
        createDefaultCategory(user, "Privat");
    }

    private void createDefaultPriority(User user, String level) {
        if (priorityRepository.findByUserIdAndLevelIgnoreCase(user.getId(), level).isEmpty()) {
            Priority priority = new Priority();
            priority.setLevel(level);
            priority.setUser(user);
            priorityRepository.save(priority);
        }
    }

    private void createDefaultCategory(User user, String name) {
        if (categoryRepository.findByUserIdAndNameIgnoreCase(user.getId(), name).isEmpty()) {
            Category category = new Category();
            category.setName(name);
            category.setUser(user);
            categoryRepository.save(category);
        }
    }
}