package ch.evers.martin.smarttask.service;

import ch.evers.martin.smarttask.entity.Category;
import ch.evers.martin.smarttask.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Alle Kategorien abrufen
    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

    // Einzelne Kategorie abrufen
    public Optional<Category> findCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Kategorie nach Name abrufen
    public Optional<Category> findCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    // Neue Kategorie erstellen
    public Category createCategory(Category category) {
        if (category.getName() == null || category.getName().isEmpty()) {
            throw new IllegalArgumentException("Kategoriename darf nicht leer sein");
        }

        if (categoryRepository.findByName(category.getName()).isPresent()) {
            throw new IllegalArgumentException("Kategorie mit diesem Namen existiert bereits");
        }

        return categoryRepository.save(category);
    }

    // Kategorie aktualisieren
    public Category updateCategory(Long id, Category updatedCategory) {
        Category existingCategory = categoryRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Kategorie nicht gefunden"));

        if (updatedCategory.getName() != null && !updatedCategory.getName().isEmpty()) {
            if (!updatedCategory.getName().equals(existingCategory.getName()) && 
                categoryRepository.findByName(updatedCategory.getName()).isPresent()) {
                throw new IllegalArgumentException("Kategorie mit diesem Namen existiert bereits");
            }
            existingCategory.setName(updatedCategory.getName());
        }

        return categoryRepository.save(existingCategory);
    }

    // Kategorie löschen
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Kategorie nicht gefunden");
        }
        categoryRepository.deleteById(id);
    }
}

