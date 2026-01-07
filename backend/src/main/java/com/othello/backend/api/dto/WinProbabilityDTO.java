package com.othello.backend.api.dto;

import lombok.Getter;

public class WinProbabilityDTO {
    @Getter
    float winProbability;

    public WinProbabilityDTO(float winProbability) {
        this.winProbability = winProbability;
    }

}
