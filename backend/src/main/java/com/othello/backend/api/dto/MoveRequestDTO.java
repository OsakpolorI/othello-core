package com.othello.backend.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MoveRequestDTO {
    private int row;
    private int column;
}
