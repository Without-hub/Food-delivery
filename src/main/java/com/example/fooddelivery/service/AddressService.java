package com.example.fooddelivery.service;

import com.example.fooddelivery.dto.AddressDTO;
import com.example.fooddelivery.entity.Address;
import java.util.List;

public interface AddressService {
    void addAddress(AddressDTO dto, Long userId);
    List<Address> listByUserId(Long userId);
    void updateAddress(AddressDTO dto, Long userId);
    void deleteAddr(Long id, Long userId);
    void setDefault(Long id, Long userId);
}