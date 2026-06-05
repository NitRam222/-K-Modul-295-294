package ch.evers.martin.smarttask.controller;

import ch.evers.martin.smarttask.entity.Priority;
import ch.evers.martin.smarttask.service.PriorityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/priorities")
@Tag(name = "Priority Management", description = "APIs für Prioritätsverwaltung")
@SecurityRequirement(name = "bearer-jwt")
public class PriorityController {

    @Autowired
    private PriorityService priorityService;

    @GetMapping
    @PreAuthorize("hasAnyRole('READ', 'UPDATE')")
    @Operation(summary = "Alle Prioritäten abrufen", description = "Liefert alle verfügbaren Prioritätsstufen")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Prioritäten erfolgreich abgerufen"),
        @ApiResponse(responseCode = "401", description = "Authentifizierung erforderlich")
    })
    public ResponseEntity<List<Priority>> getAllPriorities() {
        List<Priority> priorities = priorityService.findAllPriorities();
        return ResponseEntity.ok(priorities);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('READ', 'UPDATE')")
    @Operation(summary = "Einzelne Priorität abrufen", description = "Liefert eine spezifische Priorität anhand der ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Priorität gefunden"),
        @ApiResponse(responseCode = "404", description = "Priorität nicht gefunden"),
        @ApiResponse(responseCode = "401", description = "Authentifizierung erforderlich")
    })
    public ResponseEntity<Priority> getPriorityById(
            @Parameter(description = "Prioritäts-ID", required = true)
            @PathVariable Long id) {
        Optional<Priority> priority = priorityService.findPriorityById(id);
        return priority.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('UPDATE')")
    @Operation(summary = "Neue Priorität erstellen", description = "Erstellt eine neue Prioritätsstufe")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Priorität erfolgreich erstellt"),
        @ApiResponse(responseCode = "400", description = "Ungültige Anfrage"),
        @ApiResponse(responseCode = "403", description = "Keine Berechtigung")
    })
    public ResponseEntity<Priority> createPriority(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Prioritätsobjekt",
                content = @Content(schema = @Schema(implementation = Priority.class))
            )
            @RequestBody Priority priority) {
        try {
            Priority createdPriority = priorityService.createPriority(priority);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPriority);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('UPDATE')")
    @Operation(summary = "Priorität aktualisieren", description = "Aktualisiert eine bestehende Priorität")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Priorität erfolgreich aktualisiert"),
        @ApiResponse(responseCode = "400", description = "Ungültige Anfrage"),
        @ApiResponse(responseCode = "403", description = "Keine Berechtigung"),
        @ApiResponse(responseCode = "404", description = "Priorität nicht gefunden")
    })
    public ResponseEntity<Priority> updatePriority(
            @Parameter(description = "Prioritäts-ID", required = true)
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Aktualisiertes Prioritätsobjekt",
                content = @Content(schema = @Schema(implementation = Priority.class))
            )
            @RequestBody Priority priority) {
        try {
            Priority updatedPriority = priorityService.updatePriority(id, priority);
            return ResponseEntity.ok(updatedPriority);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('UPDATE')")
    @Operation(summary = "Priorität löschen", description = "Löscht eine bestehende Priorität")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Priorität erfolgreich gelöscht"),
        @ApiResponse(responseCode = "403", description = "Keine Berechtigung"),
        @ApiResponse(responseCode = "404", description = "Priorität nicht gefunden")
    })
    public ResponseEntity<Void> deletePriority(
            @Parameter(description = "Prioritäts-ID", required = true)
            @PathVariable Long id) {
        try {
            priorityService.deletePriority(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

