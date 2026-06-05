package ch.evers.martin.smarttask.controller;

import ch.evers.martin.smarttask.entity.Task;
import ch.evers.martin.smarttask.service.TaskService;
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
@RequestMapping("/api/tasks")
@Tag(name = "Task Management", description = "APIs für Aufgabenverwaltung")
@SecurityRequirement(name = "bearer-jwt")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    @PreAuthorize("hasAnyRole('READ', 'UPDATE')")
    @Operation(summary = "Alle Aufgaben abrufen", description = "Liefert alle Aufgaben des angemeldeten Benutzers")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Aufgaben erfolgreich abgerufen"),
        @ApiResponse(responseCode = "401", description = "Authentifizierung erforderlich")
    })
    public ResponseEntity<List<Task>> getAllTasks() {
            List<Task> tasks = taskService.findAllTasksByCurrentUser();
            return ResponseEntity.ok(tasks);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('READ', 'UPDATE', 'DEFAULT-ROLES-MYREALM')")
    @Operation(summary = "Ausstehende Aufgaben abrufen", description = "Liefert alle nicht abgeschlossenen Aufgaben")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ausstehende Aufgaben erfolgreich abgerufen"),
        @ApiResponse(responseCode = "401", description = "Authentifizierung erforderlich")
    })
    public ResponseEntity<List<Task>> getPendingTasks() {
        List<Task> tasks = taskService.findPendingTasksByCurrentUser();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/completed")
    @PreAuthorize("hasAnyRole('READ', 'UPDATE')")
    @Operation(summary = "Abgeschlossene Aufgaben abrufen", description = "Liefert alle abgeschlossenen Aufgaben")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Abgeschlossene Aufgaben erfolgreich abgerufen"),
        @ApiResponse(responseCode = "401", description = "Authentifizierung erforderlich")
    })
    public ResponseEntity<List<Task>> getCompletedTasks() {
        List<Task> tasks = taskService.findCompletedTasksByCurrentUser();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('READ', 'UPDATE')")
    @Operation(summary = "Einzelne Aufgabe abrufen", description = "Liefert eine spezifische Aufgabe anhand der ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Aufgabe gefunden"),
        @ApiResponse(responseCode = "404", description = "Aufgabe nicht gefunden"),
        @ApiResponse(responseCode = "401", description = "Authentifizierung erforderlich")
    })
    public ResponseEntity<Task> getTaskById(
            @Parameter(description = "Aufgaben-ID", required = true)
            @PathVariable Long id) {
        Optional<Task> task = taskService.findTaskById(id);
        return task.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('UPDATE')")
    @Operation(summary = "Neue Aufgabe erstellen", description = "Erstellt eine neue Aufgabe für den angemeldeten Benutzer")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Aufgabe erfolgreich erstellt"),
        @ApiResponse(responseCode = "400", description = "Ungültige Anfrage"),
        @ApiResponse(responseCode = "403", description = "Keine Berechtigung")
    })
    public ResponseEntity<Task> createTask(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Aufgabenobjekt",
                content = @Content(schema = @Schema(implementation = Task.class))
            )
            @RequestBody Task task) {
        try {
            Task createdTask = taskService.createTask(task);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('UPDATE')")
    @Operation(summary = "Aufgabe aktualisieren", description = "Aktualisiert eine bestehende Aufgabe")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Aufgabe erfolgreich aktualisiert"),
        @ApiResponse(responseCode = "400", description = "Ungültige Anfrage"),
        @ApiResponse(responseCode = "403", description = "Keine Berechtigung"),
        @ApiResponse(responseCode = "404", description = "Aufgabe nicht gefunden")
    })
    public ResponseEntity<Task> updateTask(
            @Parameter(description = "Aufgaben-ID", required = true)
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Aktualisiertes Aufgabenobjekt",
                content = @Content(schema = @Schema(implementation = Task.class))
            )
            @RequestBody Task task) {
        try {
            Task updatedTask = taskService.updateTask(id, task);
            return ResponseEntity.ok(updatedTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('UPDATE')")
    @Operation(summary = "Aufgabe löschen", description = "Löscht eine bestehende Aufgabe")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Aufgabe erfolgreich gelöscht"),
        @ApiResponse(responseCode = "403", description = "Keine Berechtigung"),
        @ApiResponse(responseCode = "404", description = "Aufgabe nicht gefunden")
    })
    public ResponseEntity<Void> deleteTask(
            @Parameter(description = "Aufgaben-ID", required = true)
            @PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
