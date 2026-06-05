package ch.evers.martin.smarttask.service;

import ch.evers.martin.smarttask.entity.Priority;
import ch.evers.martin.smarttask.repository.PriorityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PriorityService {

    @Autowired
    private PriorityRepository priorityRepository;

    // Alle Prioritäten abrufen
    public List<Priority> findAllPriorities() {
        return priorityRepository.findAll();
    }

    // Einzelne Priorität abrufen
    public Optional<Priority> findPriorityById(Long id) {
        return priorityRepository.findById(id);
    }

    // Priorität nach Level abrufen
    public Optional<Priority> findPriorityByLevel(String level) {
        return priorityRepository.findByLevel(level);
    }

    // Neue Priorität erstellen
    public Priority createPriority(Priority priority) {
        if (priority.getLevel() == null || priority.getLevel().isEmpty()) {
            throw new IllegalArgumentException("Prioritätslevel darf nicht leer sein");
        }

        if (priorityRepository.findByLevel(priority.getLevel()).isPresent()) {
            throw new IllegalArgumentException("Priorität mit diesem Level existiert bereits");
        }

        return priorityRepository.save(priority);
    }

    // Priorität aktualisieren
    public Priority updatePriority(Long id, Priority updatedPriority) {
        Priority existingPriority = priorityRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Priorität nicht gefunden"));

        if (updatedPriority.getLevel() != null && !updatedPriority.getLevel().isEmpty()) {
            if (!updatedPriority.getLevel().equals(existingPriority.getLevel()) && 
                priorityRepository.findByLevel(updatedPriority.getLevel()).isPresent()) {
                throw new IllegalArgumentException("Priorität mit diesem Level existiert bereits");
            }
            existingPriority.setLevel(updatedPriority.getLevel());
        }

        return priorityRepository.save(existingPriority);
    }

    // Priorität löschen
    public void deletePriority(Long id) {
        if (!priorityRepository.existsById(id)) {
            throw new IllegalArgumentException("Priorität nicht gefunden");
        }
        priorityRepository.deleteById(id);
    }
}

