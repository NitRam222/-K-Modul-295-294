package ch.evers.martin.smarttask.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.Collection;
import java.util.stream.Collectors;

public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = authoritiesConverter.convert(jwt);

        // Realm-Rollen von Keycloak hinzufügen
        var realmAccess = jwt.getClaimAsMap("realm_access");
        if (realmAccess != null && realmAccess.containsKey("roles")) {
            @SuppressWarnings("unchecked")
            var roles = (java.util.Collection<String>) realmAccess.get("roles");
            authorities.addAll(roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .collect(Collectors.toList()));
        }

        // Client-Rollen von Keycloak hinzufügen
        var resourceAccess = jwt.getClaimAsMap("resource_access");
        if (resourceAccess != null) {
            for (Object clientValue : resourceAccess.values()) {
                if (clientValue instanceof java.util.Map<?, ?> clientMap) {
                    Object clientRoles = clientMap.get("roles");
                    if (clientRoles instanceof java.util.Collection<?> rolesCollection) {
                        @SuppressWarnings("unchecked")
                        var roles = (java.util.Collection<String>) rolesCollection;
                        authorities.addAll(roles.stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                            .collect(Collectors.toList()));
                    }
                }
            }
        }

        String principalName = jwt.getClaimAsString("preferred_username");
        if (principalName == null || principalName.isBlank()) {
            principalName = jwt.getSubject();
        }

        return new JwtAuthenticationToken(jwt, authorities, principalName);
    }
}



