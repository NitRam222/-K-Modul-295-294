package ch.evers.martin.smarttask.service;

import ch.evers.martin.smarttask.entity.Task;
import ch.evers.martin.smarttask.entity.User;
import ch.evers.martin.smarttask.repository.TaskRepository;
import ch.evers.martin.smarttask.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private TaskService taskService;

    private User testUser;
    private Task testTask;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setCompleted(false);
        testTask.setUser(testUser);
    }

    @Test
    public void testFindAllTasksByCurrentUser() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findByUserId(1L)).thenReturn(Arrays.asList(testTask));

        List<Task> tasks = taskService.findAllTasksByCurrentUser();

        assertEquals(1, tasks.size());
        assertEquals("Test Task", tasks.get(0).getTitle());
        verify(taskRepository).findByUserId(1L);
    }

    @Test
    public void testFindPendingTasksByCurrentUser() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findByUserIdAndCompletedFalse(1L)).thenReturn(Arrays.asList(testTask));

        List<Task> tasks = taskService.findPendingTasksByCurrentUser();

        assertEquals(1, tasks.size());
        assertFalse(tasks.get(0).getCompleted());
        verify(taskRepository).findByUserIdAndCompletedFalse(1L);
    }

    @Test
    public void testFindCompletedTasksByCurrentUser() {
        testTask.setCompleted(true);
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findByUserIdAndCompletedTrue(1L)).thenReturn(Arrays.asList(testTask));

        List<Task> tasks = taskService.findCompletedTasksByCurrentUser();

        assertEquals(1, tasks.size());
        assertTrue(tasks.get(0).getCompleted());
        verify(taskRepository).findByUserIdAndCompletedTrue(1L);
    }

    @Test
    public void testFindTaskById_Success() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));

        Optional<Task> result = taskService.findTaskById(1L);

        assertTrue(result.isPresent());
        assertEquals("Test Task", result.get().getTitle());
    }

    @Test
    public void testFindTaskById_NotFound() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Task> result = taskService.findTaskById(1L);

        assertFalse(result.isPresent());
    }

    @Test
    public void testFindTaskById_WrongUser() {
        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setUsername("otheruser");

        Task taskOfOtherUser = new Task();
        taskOfOtherUser.setId(1L);
        taskOfOtherUser.setTitle("Other Task");
        taskOfOtherUser.setUser(otherUser);

        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(taskOfOtherUser));

        Optional<Task> result = taskService.findTaskById(1L);

        assertFalse(result.isPresent());
    }

    @Test
    public void testCreateTask_Success() {
        Task newTask = new Task();
        newTask.setTitle("New Task");
        newTask.setDescription("New Description");

        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        Task result = taskService.createTask(newTask);

        assertNotNull(result);
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    public void testCreateTask_EmptyTitle() {
        Task newTask = new Task();
        newTask.setTitle("");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            taskService.createTask(newTask);
        });

        assertEquals("Titel darf nicht leer sein", exception.getMessage());
    }

    @Test
    public void testUpdateTask_Success() {
        Task updatedTask = new Task();
        updatedTask.setTitle("Updated Title");
        updatedTask.setDescription("Updated Description");
        updatedTask.setCompleted(true);

        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        Task result = taskService.updateTask(1L, updatedTask);

        assertNotNull(result);
        verify(taskRepository).save(testTask);
    }

    @Test
    public void testUpdateTask_NotFound() {
        Task updatedTask = new Task();
        updatedTask.setTitle("Updated Title");

        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            taskService.updateTask(1L, updatedTask);
        });

        assertEquals("Aufgabe nicht gefunden", exception.getMessage());
    }

    @Test
    public void testUpdateTask_WrongUser() {
        User otherUser = new User();
        otherUser.setId(2L);

        Task taskOfOtherUser = new Task();
        taskOfOtherUser.setId(1L);
        taskOfOtherUser.setUser(otherUser);

        Task updatedTask = new Task();
        updatedTask.setTitle("Updated Title");

        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(taskOfOtherUser));

        SecurityException exception = assertThrows(SecurityException.class, () -> {
            taskService.updateTask(1L, updatedTask);
        });

        assertEquals("Keine Berechtigung zur Bearbeitung dieser Aufgabe", exception.getMessage());
    }

    @Test
    public void testDeleteTask_Success() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));

        taskService.deleteTask(1L);

        verify(taskRepository).deleteById(1L);
    }

    @Test
    public void testDeleteTask_NotFound() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            taskService.deleteTask(1L);
        });

        assertEquals("Aufgabe nicht gefunden", exception.getMessage());
    }

    @Test
    public void testDeleteTask_WrongUser() {
        User otherUser = new User();
        otherUser.setId(2L);

        Task taskOfOtherUser = new Task();
        taskOfOtherUser.setId(1L);
        taskOfOtherUser.setUser(otherUser);

        when(userService.getCurrentUser()).thenReturn(testUser);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(taskOfOtherUser));

        SecurityException exception = assertThrows(SecurityException.class, () -> {
            taskService.deleteTask(1L);
        });

        assertEquals("Keine Berechtigung zum Löschen dieser Aufgabe", exception.getMessage());
    }
}
