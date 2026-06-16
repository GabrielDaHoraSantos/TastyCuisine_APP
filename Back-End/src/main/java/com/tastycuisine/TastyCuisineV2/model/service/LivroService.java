package com.tastycuisine.TastyCuisineV2.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tastycuisine.TastyCuisineV2.model.entity.Livro;
import com.tastycuisine.TastyCuisineV2.model.repository.LivroRepository;

@Service
public class LivroService {

    @Autowired
    private LivroRepository LivroRepository;

    public List<Livro> findAll() { return LivroRepository.findAll(); }

    public Livro save(Livro Livro) { return LivroRepository.save(Livro); }

    public Livro findById(long codLivro) {
        return LivroRepository.findById(codLivro)
                .orElseThrow(() -> new RuntimeException("Livro não encontrada com o código " + codLivro));
    }

    public Livro update(long codLivro, Livro Livro) {
        Livro existente = findById(codLivro);
        //existente.setNomeLivro(Livro.getNomeLivro());
        return LivroRepository.save(existente);
    }

    public void delete(long codLivro) {
        LivroRepository.delete(findById(codLivro));
    }
}
