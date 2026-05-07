package ch.evers.martin.smarttask.controller;

import ch.evers.martin.smarttask.entity.User;
import ch.evers.martin.smarttask.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs für Benutzerverwaltung")
@SecurityRequirement(name = "bearer-jwt")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('READ', 'UPDATE')")
    @Operation(summary = "Aktuelles Benutzerprofil abrufen", description = "Liefert das Profil des angemeldeten Benutzers")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Benutzerprofil erfolgreich abgerufen"),
        @ApiResponse(responseCode = "401", description = "Authentifizierung erforderlich")
    })
    public ResponseEntity<User> getCurrentUserProfile() {
        User user = userService.getCurrentUserProfile();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('READ', 'UPDATE')")
    @Operation(summary = "Benutzerprofil aktualisieren", description = "Aktualisiert das Profil des angemeldeten Benutzers")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Benutzerprofil erfolgreich aktualisiert"),
        @ApiResponse(responseCode = "400", description = "Ungültige Anfrage"),
        @ApiResponse(responseCode = "401", description = "Authentifizierung erforderlich")
    })
    public ResponseEntity<User> updateUserProfile(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Aktualisierte Benutzer-Daten",
                content = @Content(schema = @Schema(implementation = User.class))
            )
            @RequestBody User user) {
        try {
            User updatedUser = userService.updateUserProfile(user);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
