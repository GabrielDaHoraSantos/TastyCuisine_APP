package com.tastycuisine.TastyCuisineV2.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

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
    private long Cod_receitas;

    @Column(name = "Nome_receita", length = 250, nullable = false)
    @NotBlank
    private String Nome_receita;

    @Column(name = "Descricao", length = 250, nullable = false)
    @NotBlank
    private String Descricao;

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
    private Usuario Usuario;

    @Column(name = "Foto_receita", nullable = true, columnDefinition = "NVARCHAR(MAX)")
    private String Foto_receita;
}
