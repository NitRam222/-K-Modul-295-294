package ch.evers.martin.smarttask.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "priorities", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "level"})})
@NoArgsConstructor
@AllArgsConstructor
public class Priority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Prioritätslevel darf nicht leer sein")
    @Column(nullable = false)
    private String level;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "priority", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Task> tasks;

    // Getters
    public Long getId() {
        return id;
    }

    public String getLevel() {
        return level;
    }

    public User getUser() {
        return user;
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

    public void setUser(User user) {
        this.user = user;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}


