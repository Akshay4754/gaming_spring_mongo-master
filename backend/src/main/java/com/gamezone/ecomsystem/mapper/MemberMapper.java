package com.gamezone.ecomsystem.mapper;

import com.gamezone.ecomsystem.dto.MemberDto;
import com.gamezone.ecomsystem.model.Member;

public class MemberMapper {
    public static MemberDto toDto(Member member) {
        MemberDto dto = new MemberDto();
        dto.setId(member.getId());
        dto.setName(member.getName());
        dto.setPhoneNumber(member.getPhoneNumber());
        dto.setEmail(member.getEmail());
        dto.setBalance(member.getBalance());
        dto.setJoiningDate(member.getJoiningDate());
        dto.setActive(member.isActive());
        return dto;
    }
}