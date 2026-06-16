package com.tastycuisine.TastyCuisineV2.controller;

import com.tastycuisine.TastyCuisineV2.model.entity.Livro;
import com.tastycuisine.TastyCuisineV2.model.service.LivroService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Livro")
public class LivroController {

    @Autowired
    private LivroService LivroService;

    @GetMapping("/findAll")
    public ResponseEntity<List<Livro>> findAll() {
        return ResponseEntity.ok(LivroService.findAll());
    }

    @PostMapping
    public ResponseEntity<Livro> save(@Valid @RequestBody Livro Livro) {
        return ResponseEntity.status(HttpStatus.CREATED).body(LivroService.save(Livro));
    }

    @GetMapping("/{codLivro}")
    public ResponseEntity<Object> findById(@PathVariable String codLivro) {
        try {
            return ResponseEntity.ok(LivroService.findById(Long.parseLong(codLivro)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codLivro));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "Livro não encontrada com o id: " + codLivro));
        }
    }

    @PutMapping("/{codLivro}")
    public ResponseEntity<Object> update(@Valid @RequestBody Livro Livro, @PathVariable String codLivro) {
        try {
            return ResponseEntity.ok(LivroService.update(Long.parseLong(codLivro), Livro));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codLivro));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "Livro não encontrada com o id: " + codLivro));
        }
    }

    @DeleteMapping("/{codLivro}")
    public ResponseEntity<Object> delete(@PathVariable String codLivro) {
        try {
            LivroService.delete(Long.parseLong(codLivro));
            return ResponseEntity.ok().body("Livro com o id " + codLivro + " foi removida com sucesso");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("status", 400, "error", "bad request", "message", "o id informado não é válido: " + codLivro));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("status", 404, "error", "not found", "message", "Livro não encontrada com o id: " + codLivro));
        }
    }
}
