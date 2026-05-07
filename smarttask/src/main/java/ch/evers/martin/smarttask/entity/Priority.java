package ch.evers.martin.smarttask.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "priorities")
@NoArgsConstructor
@AllArgsConstructor
public class Priority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Prioritätslevel darf nicht leer sein")
    @Column(unique = true, nullable = false)
    private String level;

    @OneToMany(mappedBy = "priority", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;

    // Getters
    public Long getId() {
        return id;
    }

    public String getLevel() {
        return level;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}


