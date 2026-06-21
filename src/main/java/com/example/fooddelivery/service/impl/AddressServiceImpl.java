package com.example.fooddelivery.service.impl;

import com.example.fooddelivery.dto.AddressDTO;
import com.example.fooddelivery.entity.Address;
import com.example.fooddelivery.mapper.AddressMapper;
import com.example.fooddelivery.service.AddressService;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {
    @Resource
    private AddressMapper addressMapper;

    @Override
    public void addAddress(AddressDTO dto, Long userId) {
        Address addr = new Address();
        addr.setUserId(userId);
        addr.setContactName(dto.getContactName());
        addr.setContactPhone(dto.getContactPhone());
        addr.setProvince(dto.getProvince());
        addr.setCity(dto.getCity());
        addr.setDistrict(dto.getDistrict());
        addr.setDetail(dto.getDetail());
        addr.setIsDefault(0);
        addressMapper.insert(addr);
    }

    @Override
    public List<Address> listByUserId(Long userId) {
        return addressMapper.selectByUserId(userId);
    }

    @Override
    public void updateAddress(AddressDTO dto, Long userId) {
        Address addr = (Address) addressMapper.selectByUserId(dto.getId());
        if (addr == null) {
            throw new RuntimeException("地址不存在");
        }
        addr.setContactName(dto.getContactName());
        addr.setContactPhone(dto.getContactPhone());
        addr.setProvince(dto.getProvince());
        addr.setCity(dto.getCity());
        addr.setDistrict(dto.getDistrict());
        addr.setDetail(dto.getDetail());
        addressMapper.update(addr);
    }

    @Override
    public void deleteAddr(Long id, Long userId) {
        Address addr = (Address) addressMapper.selectByUserId(id);
        if (addr == null) {
            throw new RuntimeException("地址不存在");
        }
        addressMapper.deleteById(id);
    }

    @Override
    public void setDefault(Long id, Long userId) {
        // 先把该用户所有地址取消默认
        addressMapper.clearDefault(userId);
        Address addr = new Address();
        addr.setId(id);
        addr.setIsDefault(1);
        addressMapper.update(addr);
    }
}