package ch.evers.martin.smarttask.service;

import ch.evers.martin.smarttask.entity.Category;
import ch.evers.martin.smarttask.entity.Priority;
import ch.evers.martin.smarttask.entity.Task;
import ch.evers.martin.smarttask.entity.User;
import ch.evers.martin.smarttask.repository.CategoryRepository;
import ch.evers.martin.smarttask.repository.PriorityRepository;
import ch.evers.martin.smarttask.repository.TaskRepository;
import ch.evers.martin.smarttask.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PriorityRepository priorityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // Alle Aufgaben des aktuellen Benutzers abrufen
    public List<Task> findAllTasksByCurrentUser() {
        User currentUser = userService.getCurrentUser();
        return taskRepository.findByUserId(currentUser.getId());
    }

    // Alle nicht abgeschlossenen Aufgaben abrufen
    public List<Task> findPendingTasksByCurrentUser() {
        User currentUser = userService.getCurrentUser();
        return taskRepository.findByUserIdAndCompletedFalse(currentUser.getId());
    }

    // Alle abgeschlossenen Aufgaben abrufen
    public List<Task> findCompletedTasksByCurrentUser() {
        User currentUser = userService.getCurrentUser();
        return taskRepository.findByUserIdAndCompletedTrue(currentUser.getId());
    }

    // Einzelne Aufgabe abrufen
    public Optional<Task> findTaskById(Long id) {
        User currentUser = userService.getCurrentUser();
        Optional<Task> task = taskRepository.findById(id);
        if (task.isPresent() && task.get().getUser().getId().equals(currentUser.getId())) {
            return task;
        }
        return Optional.empty();
    }

    public List<Task> findTasksByUserId(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    private Category resolveCategoryForCurrentUser(Category category) {
        if (category == null || category.getId() == null) {
            return null;
        }
        User currentUser = userService.getCurrentUser();
        Category existingCategory = categoryRepository.findById(category.getId())
                .orElseThrow(() -> new IllegalArgumentException("Kategorie nicht gefunden"));
        if (!existingCategory.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Kategorie nicht gefunden");
        }
        return existingCategory;
    }

    private Priority resolvePriorityForCurrentUser(Priority priority) {
        if (priority == null || priority.getId() == null) {
            return null;
        }
        User currentUser = userService.getCurrentUser();
        Priority existingPriority = priorityRepository.findById(priority.getId())
                .orElseThrow(() -> new IllegalArgumentException("Priorität nicht gefunden"));
        if (!existingPriority.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Priorität nicht gefunden");
        }
        return existingPriority;
    }

    // Neue Aufgabe erstellen
    public Task createTask(Task task) {
        if (task.getTitle() == null || task.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Titel darf nicht leer sein");
        }

        User currentUser = userService.getCurrentUser();
        task.setUser(currentUser);
        task.setCategory(resolveCategoryForCurrentUser(task.getCategory()));
        task.setPriority(resolvePriorityForCurrentUser(task.getPriority()));

        if (task.getStatus() == null || task.getStatus().isBlank()) {
            task.setStatus("TODO");
        }
        task.setCompleted("DONE".equalsIgnoreCase(task.getStatus()));

        if (task.getCompleted() == null) {
            task.setCompleted(false);
        }

        return taskRepository.save(task);
    }

    // Aufgabe aktualisieren
    public Task updateTask(Long id, Task updatedTask) {
        User currentUser = userService.getCurrentUser();

        Task existingTask = taskRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Aufgabe nicht gefunden"));

        if (!existingTask.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("Keine Berechtigung zur Bearbeitung dieser Aufgabe");
        }

        if (updatedTask.getTitle() != null && !updatedTask.getTitle().isEmpty()) {
            existingTask.setTitle(updatedTask.getTitle());
        }

        if (updatedTask.getDescription() != null) {
            existingTask.setDescription(updatedTask.getDescription());
        }

        if (updatedTask.getStatus() != null && !updatedTask.getStatus().isBlank()) {
            existingTask.setStatus(updatedTask.getStatus());
            existingTask.setCompleted("DONE".equalsIgnoreCase(updatedTask.getStatus()));
        }

        if (updatedTask.getCompleted() != null) {
            existingTask.setCompleted(updatedTask.getCompleted());
        }

        if (updatedTask.getDueDate() != null) {
            existingTask.setDueDate(updatedTask.getDueDate());
        }

        if (updatedTask.getCategory() != null) {
            existingTask.setCategory(resolveCategoryForCurrentUser(updatedTask.getCategory()));
        }

        if (updatedTask.getPriority() != null) {
            existingTask.setPriority(resolvePriorityForCurrentUser(updatedTask.getPriority()));
        }

        return taskRepository.save(existingTask);
    }

    // Aufgabe löschen
    public void deleteTask(Long id) {
        User currentUser = userService.getCurrentUser();

        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Aufgabe nicht gefunden"));

        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("Keine Berechtigung zum Löschen dieser Aufgabe");
        }

        taskRepository.deleteById(id);
    }
}
