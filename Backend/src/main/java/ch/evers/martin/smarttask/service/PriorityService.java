package ch.evers.martin.smarttask.service;

import ch.evers.martin.smarttask.entity.Priority;
import ch.evers.martin.smarttask.entity.User;
import ch.evers.martin.smarttask.repository.PriorityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PriorityService {

    @Autowired
    private PriorityRepository priorityRepository;

    @Autowired
    private UserService userService;

    // Alle Prioritäten abrufen
    public List<Priority> findAllPriorities() {
        User currentUser = userService.getCurrentUser();
        return priorityRepository.findByUserId(currentUser.getId());
    }

    // Einzelne Priorität abrufen
    public Optional<Priority> findPriorityById(Long id) {
        User currentUser = userService.getCurrentUser();
        return priorityRepository.findById(id)
                .filter(priority -> priority.getUser().getId().equals(currentUser.getId()));
    }

    // Priorität nach Level abrufen
    public Optional<Priority> findPriorityByLevel(String level) {
        User currentUser = userService.getCurrentUser();
        return priorityRepository.findByUserIdAndLevelIgnoreCase(currentUser.getId(), level);
    }

    // Neue Priorität erstellen
    public Priority createPriority(Priority priority) {
        if (priority.getLevel() == null || priority.getLevel().trim().isEmpty()) {
            throw new IllegalArgumentException("Prioritätslevel darf nicht leer sein");
        }

        String priorityLevel = priority.getLevel().trim();
        User currentUser = userService.getCurrentUser();
        if (priorityRepository.findByUserIdAndLevelIgnoreCase(currentUser.getId(), priorityLevel).isPresent()) {
            throw new IllegalArgumentException("Priorität mit diesem Level existiert bereits");
        }

        priority.setLevel(priorityLevel);
        priority.setUser(currentUser);
        return priorityRepository.save(priority);
    }

    // Priorität aktualisieren
    public Priority updatePriority(Long id, Priority updatedPriority) {
        User currentUser = userService.getCurrentUser();
        Priority existingPriority = priorityRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Priorität nicht gefunden"));

        if (!existingPriority.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Priorität nicht gefunden");
        }

        if (updatedPriority.getLevel() != null && !updatedPriority.getLevel().trim().isEmpty()) {
            String updatedLevel = updatedPriority.getLevel().trim();
            if (!updatedLevel.equalsIgnoreCase(existingPriority.getLevel()) && 
                priorityRepository.findByUserIdAndLevelIgnoreCase(currentUser.getId(), updatedLevel).isPresent()) {
                throw new IllegalArgumentException("Priorität mit diesem Level existiert bereits");
            }
            existingPriority.setLevel(updatedLevel);
        }

        return priorityRepository.save(existingPriority);
    }

    // Priorität löschen
    public void deletePriority(Long id) {
        User currentUser = userService.getCurrentUser();
        Priority existingPriority = priorityRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Priorität nicht gefunden"));

        if (!existingPriority.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Priorität nicht gefunden");
        }

        priorityRepository.deleteById(id);
    }
}

