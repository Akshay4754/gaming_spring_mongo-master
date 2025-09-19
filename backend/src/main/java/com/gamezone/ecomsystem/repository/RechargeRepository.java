package com.gamezone.ecomsystem.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gamezone.ecomsystem.model.Recharge;

import java.util.List;

public interface RechargeRepository extends MongoRepository<Recharge, String> {
    List<Recharge> findByMemberId(String memberId);
}