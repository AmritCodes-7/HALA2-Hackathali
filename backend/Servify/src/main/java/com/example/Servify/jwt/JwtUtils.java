package com.example.Servify.jwt;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
    
    //!hide this later my guy u keep forgeting it
    private final String secretKey = "the-boka-eats-grass-and-poops-in-daytime";
    private final SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());


    //!call this from the login function and get the fucking token
    public String generateToken(UserDetails user){

        //*put the claims u wanna extract later 
        //!also dont put the fucking password here
        Map<String,Object> claims = new HashMap<>();
        claims.put("roles",user.getAuthorities().stream().map(role -> role.getAuthority()).toList()); //* will prolly not use it :) */

        //! pray to god that this shit works ion last time it dint work
        return Jwts.builder()
            .subject(user.getUsername())
            .claims(claims)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 30))//30 days
            .signWith(key)
            .compact();
    }

    //* this shit for extraction also make sure to verify
    //* that the token is not expired
    public Claims extractClaims(String token){
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();

        //! honestly tho this shit is just too repeatative 
    }

    //! a wall so that you aint verifying with a expired token
    public boolean isExpired(String token){
        //* basically compares expiration date with current date
        // * .before returns boolean if its  */
         try {
            return extractClaims(token)
                .getExpiration()
                .before(new Date());
        } catch (Exception e) {
            return true; 
        }
    }

    public boolean validateToken(String token,UserDetails user,String username){
        return username.equals(user.getUsername()) && !isExpired(token);
    }

    public String extractUsername(String token){
        return(String) extractClaims(token).getSubject();
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token){
        return (List<String>) extractClaims(token).get("roles");
    }
}
