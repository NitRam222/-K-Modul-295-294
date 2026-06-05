package ch.evers.martin.smarttask.service;

import ch.evers.martin.smarttask.entity.User;
import ch.evers.martin.smarttask.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, query);
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
        Object principal = authentication.getPrincipal();

        if (username == null || username.isBlank()) {
            if (principal instanceof org.springframework.security.oauth2.jwt.Jwt jwt) {
                username = jwt.getClaimAsString("preferred_username");
                if (username == null || username.isBlank()) {
                    username = jwt.getClaimAsString("email");
                }
                if (username == null || username.isBlank()) {
                    username = jwt.getSubject();
                }
            }
        }

        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Benutzername im Token fehlt");
        }

        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            User currentUser = existingUser.get();
            String tokenEmail = null;
            if (principal instanceof org.springframework.security.oauth2.jwt.Jwt jwt) {
                tokenEmail = jwt.getClaimAsString("email");
            }
            if (tokenEmail != null && !tokenEmail.isBlank() && !tokenEmail.equals(currentUser.getEmail())) {
                currentUser.setEmail(tokenEmail);
                userRepository.save(currentUser);
            }
            return currentUser;
        }

        // Rolle aus Authorities extrahieren
        String role = authentication.getAuthorities().stream()
            .filter(auth -> auth.getAuthority().startsWith("ROLE_"))
            .map(auth -> auth.getAuthority().substring(5)) // Entferne "ROLE_"
            .findFirst()
            .orElse("READ"); // Default

        String email = null;
        if (principal instanceof org.springframework.security.oauth2.jwt.Jwt jwt) {
            email = jwt.getClaimAsString("email");
        }
        if (email == null || email.isBlank()) {
            email = username + "@example.com"; // Placeholder email
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
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

        if (updatedUser.getDescription() != null) {
            currentUser.setDescription(updatedUser.getDescription());
        }

        return userRepository.save(currentUser);
    }
}
