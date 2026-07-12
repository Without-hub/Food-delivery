package com.example.fooddelivery.dto;

import lombok.Data;

@Data
public class AddressDTO {
    private Long id;
    private String contactName;
    private String contactPhone;
    private String province;
    private String city;
    private String district;
    private String detail;
}
