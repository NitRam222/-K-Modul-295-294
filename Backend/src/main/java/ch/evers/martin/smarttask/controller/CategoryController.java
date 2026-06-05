package ch.evers.martin.smarttask.controller;

import ch.evers.martin.smarttask.entity.Category;
import ch.evers.martin.smarttask.service.CategoryService;
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
@RequestMapping("/api/categories")
@Tag(name = "Category Management", description = "APIs für Kategorienverwaltung")
@SecurityRequirement(name = "bearer-jwt")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('READ', 'UPDATE')")
    @Operation(summary = "Alle Kategorien abrufen", description = "Liefert alle verfügbaren Kategorien")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Kategorien erfolgreich abgerufen"),
        @ApiResponse(responseCode = "401", description = "Authentifizierung erforderlich")
    })
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.findAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('READ', 'UPDATE')")
    @Operation(summary = "Einzelne Kategorie abrufen", description = "Liefert eine spezifische Kategorie anhand der ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Kategorie gefunden"),
        @ApiResponse(responseCode = "404", description = "Kategorie nicht gefunden"),
        @ApiResponse(responseCode = "401", description = "Authentifizierung erforderlich")
    })
    public ResponseEntity<Category> getCategoryById(
            @Parameter(description = "Kategorie-ID", required = true)
            @PathVariable Long id) {
        Optional<Category> category = categoryService.findCategoryById(id);
        return category.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('UPDATE')")
    @Operation(summary = "Neue Kategorie erstellen", description = "Erstellt eine neue Kategorie")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Kategorie erfolgreich erstellt"),
        @ApiResponse(responseCode = "400", description = "Ungültige Anfrage"),
        @ApiResponse(responseCode = "403", description = "Keine Berechtigung")
    })
    public ResponseEntity<Category> createCategory(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Kategorieobjekt",
                content = @Content(schema = @Schema(implementation = Category.class))
            )
            @RequestBody Category category) {
        try {
            Category createdCategory = categoryService.createCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('UPDATE')")
    @Operation(summary = "Kategorie aktualisieren", description = "Aktualisiert eine bestehende Kategorie")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Kategorie erfolgreich aktualisiert"),
        @ApiResponse(responseCode = "400", description = "Ungültige Anfrage"),
        @ApiResponse(responseCode = "403", description = "Keine Berechtigung"),
        @ApiResponse(responseCode = "404", description = "Kategorie nicht gefunden")
    })
    public ResponseEntity<Category> updateCategory(
            @Parameter(description = "Kategorie-ID", required = true)
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Aktualisiertes Kategorieobjekt",
                content = @Content(schema = @Schema(implementation = Category.class))
            )
            @RequestBody Category category) {
        try {
            Category updatedCategory = categoryService.updateCategory(id, category);
            return ResponseEntity.ok(updatedCategory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('UPDATE')")
    @Operation(summary = "Kategorie löschen", description = "Löscht eine bestehende Kategorie")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Kategorie erfolgreich gelöscht"),
        @ApiResponse(responseCode = "403", description = "Keine Berechtigung"),
        @ApiResponse(responseCode = "404", description = "Kategorie nicht gefunden")
    })
    public ResponseEntity<Void> deleteCategory(
            @Parameter(description = "Kategorie-ID", required = true)
            @PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

