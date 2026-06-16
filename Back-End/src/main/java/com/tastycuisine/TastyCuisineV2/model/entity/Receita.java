package com.tastycuisine.TastyCuisineV2.model.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Receitas")
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Cod_receitas")
    private long codReceitas;

    @Column(name = "Nome_receita", length = 250, nullable = false)
    @NotBlank
    private String nomeReceita;

    @Column(name = "Descricao", length = 250, nullable = false)
    @NotBlank
    private String descricao;

    @Column(name = "Modo_preparo", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    @NotBlank
    private String Modo_preparo;

    @Column(name = "Ingredientes", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    @NotBlank
    private String Ingredientes;

    @ManyToMany
    @Column(name = "Categorias", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    @NotBlank
    private List<Categoria> Categorias;

    @Column(name = "Restricao", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    @NotBlank
    private String Restricao;

    @ManyToOne
    @JoinColumn(name = "Cod_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "Foto_receita", nullable = true, columnDefinition = "NVARCHAR(MAX)")
    private String fotoReceita;
}
