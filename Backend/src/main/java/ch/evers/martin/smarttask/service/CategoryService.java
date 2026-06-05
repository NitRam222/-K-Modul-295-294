package ch.evers.martin.smarttask.service;

import ch.evers.martin.smarttask.entity.Category;
import ch.evers.martin.smarttask.entity.User;
import ch.evers.martin.smarttask.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserService userService;

    // Alle Kategorien abrufen
    public List<Category> findAllCategories() {
        User currentUser = userService.getCurrentUser();
        return categoryRepository.findByUserId(currentUser.getId());
    }

    // Einzelne Kategorie abrufen
    public Optional<Category> findCategoryById(Long id) {
        User currentUser = userService.getCurrentUser();
        return categoryRepository.findById(id)
                .filter(category -> category.getUser().getId().equals(currentUser.getId()));
    }

    // Kategorie nach Name abrufen
    public Optional<Category> findCategoryByName(String name) {
        User currentUser = userService.getCurrentUser();
        return categoryRepository.findByUserIdAndNameIgnoreCase(currentUser.getId(), name);
    }

    // Neue Kategorie erstellen
    public Category createCategory(Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Kategoriename darf nicht leer sein");
        }

        String categoryName = category.getName().trim();
        User currentUser = userService.getCurrentUser();
        if (categoryRepository.findByUserIdAndNameIgnoreCase(currentUser.getId(), categoryName).isPresent()) {
            throw new IllegalArgumentException("Kategorie mit diesem Namen existiert bereits");
        }

        category.setName(categoryName);
        category.setUser(currentUser);
        return categoryRepository.save(category);
    }

    // Kategorie aktualisieren
    public Category updateCategory(Long id, Category updatedCategory) {
        User currentUser = userService.getCurrentUser();
        Category existingCategory = categoryRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Kategorie nicht gefunden"));

        if (!existingCategory.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Kategorie nicht gefunden");
        }

        if (updatedCategory.getName() != null && !updatedCategory.getName().trim().isEmpty()) {
            String updatedName = updatedCategory.getName().trim();
            if (!updatedName.equalsIgnoreCase(existingCategory.getName()) && 
                categoryRepository.findByUserIdAndNameIgnoreCase(currentUser.getId(), updatedName).isPresent()) {
                throw new IllegalArgumentException("Kategorie mit diesem Namen existiert bereits");
            }
            existingCategory.setName(updatedName);
        }

        return categoryRepository.save(existingCategory);
    }

    // Kategorie löschen
    public void deleteCategory(Long id) {
        User currentUser = userService.getCurrentUser();
        Category existingCategory = categoryRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Kategorie nicht gefunden"));

        if (!existingCategory.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Kategorie nicht gefunden");
        }

        categoryRepository.deleteById(id);
    }
}

