package ch.evers.martin.smarttask.service;

import ch.evers.martin.smarttask.entity.User;
import ch.evers.martin.smarttask.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Benutzer nach ID abrufen
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    // Benutzer nach Benutzername abrufen
    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Benutzer nach Email abrufen
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Neuen Benutzer erstellen
    public User createUser(User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new IllegalArgumentException("Benutzername darf nicht leer sein");
        }

        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email darf nicht leer sein");
        }

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Benutzer mit diesem Namen existiert bereits");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Benutzer mit dieser Email existiert bereits");
        }

        return userRepository.save(user);
    }

    // Aktuellen angemeldeten Benutzer abrufen oder erstellen
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("Nicht authentifiziert");
        }

        String username = authentication.getName();

        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // Rolle aus Authorities extrahieren
        String role = authentication.getAuthorities().stream()
            .filter(auth -> auth.getAuthority().startsWith("ROLE_"))
            .map(auth -> auth.getAuthority().substring(5)) // Entferne "ROLE_"
            .findFirst()
            .orElse("READ"); // Default

        // Neuen User erstellen
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(username + "@example.com"); // Placeholder email
        newUser.setRole(role);

        return userRepository.save(newUser);
    }

    // Aktuelles Benutzerprofil abrufen
    public User getCurrentUserProfile() {
        return getCurrentUser();
    }

    // Benutzerprofil aktualisieren
    public User updateUserProfile(User updatedUser) {
        User currentUser = getCurrentUserProfile();

        if (updatedUser.getEmail() != null && !updatedUser.getEmail().isEmpty()) {
            if (!updatedUser.getEmail().equals(currentUser.getEmail()) &&
                userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email wird bereits verwendet");
            }
            currentUser.setEmail(updatedUser.getEmail());
        }

        return userRepository.save(currentUser);
    }
}
