package com.othello.backend.api.dto;

import lombok.Getter;

public class NewGameRequestDTO {
    @Getter
    private final String strategy;

    public NewGameRequestDTO(String strategy) {
        this.strategy = strategy;
    }
}
