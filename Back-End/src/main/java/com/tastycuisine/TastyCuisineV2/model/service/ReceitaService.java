package com.tastycuisine.TastyCuisineV2.model.service;

import com.tastycuisine.TastyCuisineV2.model.entity.Receita;
import com.tastycuisine.TastyCuisineV2.model.repository.ReceitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReceitaService {

    @Autowired
    private ReceitaRepository receitaRepository;

    public List<Receita> findAll() { return receitaRepository.findAll(); }

    public Receita save(Receita receita) { return receitaRepository.save(receita); }

    public Receita findById(long codReceitas) {
        return receitaRepository.findById(codReceitas)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada com o código " + codReceitas));
    }

    public Receita update(long codReceitas, Receita receita) {
        Receita existente = findById(codReceitas);

        existente.setNome_receita(receita.getNome_receita());
        existente.setDescricao(receita.getDescricao());
        existente.setModo_preparo(receita.getModo_preparo());
        existente.setIngredientes(receita.getIngredientes());
        existente.setCategorias(receita.getCategorias());
        existente.setUsuario(receita.getUsuario());
        existente.setFoto_receita(receita.getFoto_receita());
        existente.setRestricao(receita.getRestricao());
        return receitaRepository.save(existente);
    }

    public List<Receita> findByChefe(long codChefe) {
        return receitaRepository.findByChefeCodChefe(codChefe);
    }

    public List<Receita> buscar(String termo) {
        return receitaRepository.findByNomeReceitaContainingIgnoreCase(termo);
    }

    public List<Receita> populares() {
        return receitaRepository.findAll().stream()
                .limit(10)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Receita> findByCategoria(long codCategoria) {
        return receitaRepository.findAll().stream()
                .filter(r -> r.getCategorias().stream()
                        .anyMatch(c -> c.getCodCategoria() == codCategoria))
                .collect(java.util.stream.Collectors.toList());
    }

    public void delete(long codReceitas) {
        receitaRepository.delete(findById(codReceitas));
    }
}
