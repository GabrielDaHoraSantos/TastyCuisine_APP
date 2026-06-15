package com.tastycuisine.TastyCuisineV2.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Comentarios")
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Cod_comentarios")
    private long Cod_comentarios;

    @ManyToOne
    @JoinColumn(name = "Cod_user", nullable = false)
    private Usuario Usuario;

    @ManyToOne
    @JoinColumn(name = "Cod_receitas")
    private Receita Receita;
    
    @Column(name = "Nota", nullable = false)
    @NotBlank
    private String Nota;

    @Column(name = "Texto", length = 300, nullable = false)
    @NotBlank
    private String Texto;

    @CreationTimestamp
    @Column(name = "Data_Comentario", updatable = false)
    private LocalDateTime Data_Comentario;
}
