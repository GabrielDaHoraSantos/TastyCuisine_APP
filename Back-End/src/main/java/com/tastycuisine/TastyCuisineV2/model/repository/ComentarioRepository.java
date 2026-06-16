package com.tastycuisine.TastyCuisineV2.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tastycuisine.TastyCuisineV2.model.entity.Comentario;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {List<Comentario> findByReceitaCodReceitas(Long codReceitas);
}
