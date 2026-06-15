package com.tastycuisine.TastyCuisineV2.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tastycuisine.TastyCuisineV2.model.entity.Chefe;

@Repository
public interface ChefeRepository extends JpaRepository<Chefe, Long> {
    Optional<Chefe> findByGmail(String gmail);
    List<Chefe> findByNomeUsuarioContainingIgnoreCase(String termo);
}
