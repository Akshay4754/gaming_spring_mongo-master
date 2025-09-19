package com.gamezone.ecomsystem.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gamezone.ecomsystem.model.Transaction;

import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByMemberId(String memberId);
    List<Transaction> findByGameId(String gameId);
}