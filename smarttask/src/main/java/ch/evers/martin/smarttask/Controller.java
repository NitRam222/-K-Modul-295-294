package ch.evers.martin.smarttask;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health Check", description = "Gesundheitsstatus der API")
public class Controller {

    @GetMapping
    @Operation(summary = "Health Check", description = "Überprüft, ob die API verfügbar ist")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "API ist verfügbar")
    })
    public String health() {
        return "SmartTask API is running";
    }
}


