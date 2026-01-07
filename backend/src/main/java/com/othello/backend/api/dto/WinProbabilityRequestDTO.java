package com.othello.backend.api.dto;

import lombok.Getter;

public class WinProbabilityRequestDTO {
    @Getter
    int simulations;

    public WinProbabilityRequestDTO(int simulations) {
        this.simulations = simulations;
    }
}
