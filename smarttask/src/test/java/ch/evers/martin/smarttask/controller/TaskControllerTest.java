package ch.evers.martin.smarttask.controller;

import ch.evers.martin.smarttask.entity.Task;
import ch.evers.martin.smarttask.entity.User;
import ch.evers.martin.smarttask.repository.TaskRepository;
import ch.evers.martin.smarttask.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class TaskControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // Create a test user
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setRole("UPDATE");
        testUser = userRepository.save(testUser);
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"UPDATE"})
    public void testGetAllTasks() throws Exception {
        // Create a test task
        Task task = new Task();
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setCompleted(false);
        task.setUser(testUser);
        taskRepository.save(task);

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].title").value("Test Task"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"UPDATE"})
    public void testCreateTask() throws Exception {
        Task newTask = new Task();
        newTask.setTitle("New Task");
        newTask.setDescription("New Description");
        newTask.setCompleted(false);
        newTask.setDueDate(LocalDate.now().plusDays(7));

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newTask))
                .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Task"))
                .andExpect(jsonPath("$.description").value("New Description"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"UPDATE"})
    public void testCreateTaskWithEmptyTitle() throws Exception {
        Task newTask = new Task();
        newTask.setTitle("");
        newTask.setDescription("Description");

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newTask))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"UPDATE"})
    public void testGetTaskById() throws Exception {
        Task task = new Task();
        task.setTitle("Specific Task");
        task.setDescription("Specific Description");
        task.setCompleted(false);
        task.setUser(testUser);
        Task savedTask = taskRepository.save(task);

        mockMvc.perform(get("/api/tasks/" + savedTask.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Specific Task"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"UPDATE"})
    public void testGetTaskByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/tasks/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"UPDATE"})
    public void testUpdateTask() throws Exception {
        Task task = new Task();
        task.setTitle("Original Task");
        task.setDescription("Original Description");
        task.setCompleted(false);
        task.setUser(testUser);
        Task savedTask = taskRepository.save(task);

        Task updatedTask = new Task();
        updatedTask.setTitle("Updated Task");
        updatedTask.setDescription("Updated Description");
        updatedTask.setCompleted(true);

        mockMvc.perform(put("/api/tasks/" + savedTask.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedTask))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Task"))
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    @WithMockUser(username = "testuser", roles = {"UPDATE"})
    public void testDeleteTask() throws Exception {
        Task task = new Task();
        task.setTitle("Task to Delete");
        task.setDescription("Will be deleted");
        task.setCompleted(false);
        task.setUser(testUser);
        Task savedTask = taskRepository.save(task);

        mockMvc.perform(delete("/api/tasks/" + savedTask.getId())
                .with(csrf()))
                .andExpect(status().isNoContent());

        // Verify task is deleted
        mockMvc.perform(get("/api/tasks/" + savedTask.getId()))
                .andExpect(status().isNotFound());
    }
}
