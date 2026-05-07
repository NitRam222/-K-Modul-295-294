package ch.evers.martin.smarttask.config;

import ch.evers.martin.smarttask.entity.Category;
import ch.evers.martin.smarttask.entity.Priority;
import ch.evers.martin.smarttask.entity.Task;
import ch.evers.martin.smarttask.entity.User;
import ch.evers.martin.smarttask.repository.CategoryRepository;
import ch.evers.martin.smarttask.repository.PriorityRepository;
import ch.evers.martin.smarttask.repository.TaskRepository;
import ch.evers.martin.smarttask.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Autowired
    private PriorityRepository priorityRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            // Initialize Priorities
            if (priorityRepository.findByLevel("LOW").isEmpty()) {
                Priority low = new Priority();
                low.setLevel("LOW");
                priorityRepository.save(low);
            }

            if (priorityRepository.findByLevel("MEDIUM").isEmpty()) {
                Priority medium = new Priority();
                medium.setLevel("MEDIUM");
                priorityRepository.save(medium);
            }

            if (priorityRepository.findByLevel("HIGH").isEmpty()) {
                Priority high = new Priority();
                high.setLevel("HIGH");
                priorityRepository.save(high);
            }

            // Initialize Categories
            if (categoryRepository.findByName("Arbeit").isEmpty()) {
                Category work = new Category();
                work.setName("Arbeit");
                categoryRepository.save(work);
            }

            if (categoryRepository.findByName("Privat").isEmpty()) {
                Category personal = new Category();
                personal.setName("Privat");
                categoryRepository.save(personal);
            }

            if (categoryRepository.findByName("Shopping").isEmpty()) {
                Category shopping = new Category();
                shopping.setName("Shopping");
                categoryRepository.save(shopping);
            }

            if (categoryRepository.findByName("Haushalt").isEmpty()) {
                Category household = new Category();
                household.setName("Haushalt");
                categoryRepository.save(household);
            }

            // Initialize Demo Users, für Testen ohne Keycloak
            if (userRepository.findByUsername("demo_read").isEmpty()) {
                User demoRead = new User();
                demoRead.setUsername("demo_read");
                demoRead.setEmail("demo_read@example.com");
                demoRead.setRole("READ");
                userRepository.save(demoRead);
            }

            if (userRepository.findByUsername("demo_update").isEmpty()) {
                User demoUpdate = new User();
                demoUpdate.setUsername("demo_update");
                demoUpdate.setEmail("demo_update@example.com");
                demoUpdate.setRole("UPDATE");
                userRepository.save(demoUpdate);
            }

            // Initialize Demo Tasks
            User demoUpdate = userRepository.findByUsername("demo_update").orElse(null);
            if (demoUpdate != null && taskRepository.count() == 0) {
                // Task 1
                Task task1 = new Task();
                task1.setTitle("Projekt abschließen");
                task1.setDescription("Das wichtige Projekt bis Ende der Woche fertigstellen.");
                task1.setCompleted(false);
                task1.setDueDate(java.time.LocalDate.now().plusDays(7));
                task1.setUser(demoUpdate);
                task1.setCategory(categoryRepository.findByName("Arbeit").orElse(null));
                task1.setPriority(priorityRepository.findByLevel("HIGH").orElse(null));
                taskRepository.save(task1);

                // Task 2
                Task task2 = new Task();
                task2.setTitle("Einkaufen gehen");
                task2.setDescription("Wocheneinkauf erledigen: Milch, Brot, Gemüse.");
                task2.setCompleted(false);
                task2.setDueDate(java.time.LocalDate.now().plusDays(1));
                task2.setUser(demoUpdate);
                task2.setCategory(categoryRepository.findByName("Shopping").orElse(null));
                task2.setPriority(priorityRepository.findByLevel("MEDIUM").orElse(null));
                taskRepository.save(task2);
            }

            System.out.println(" Database initialization completed successfully!");
        };
    }
}
