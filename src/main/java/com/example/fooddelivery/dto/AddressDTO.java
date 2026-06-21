package com.example.fooddelivery.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class AddressDTO {
    private Long id;
    private Long addressId;
    private String contactName;
    private String contactPhone;
    private String province;
    private String city;
    private String district;
    private String detail;
    private Integer isDefault;
}