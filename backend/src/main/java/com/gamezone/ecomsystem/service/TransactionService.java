package com.gamezone.ecomsystem.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gamezone.ecomsystem.exception.BusinessException;
import com.gamezone.ecomsystem.exception.ResourceNotFoundException;
import com.gamezone.ecomsystem.model.Game;
import com.gamezone.ecomsystem.model.Member;
import com.gamezone.ecomsystem.model.Transaction;
import com.gamezone.ecomsystem.repository.GameRepository;
import com.gamezone.ecomsystem.repository.MemberRepository;
import com.gamezone.ecomsystem.repository.TransactionRepository;

import java.util.Date; // <-- Make sure this import is present
import java.util.List;

@Service
public class TransactionService {
    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private TransactionRepository repo;

    @Autowired
    private MemberRepository memberRepo; // To update member balance

    @Autowired
    private GameRepository gameRepo; // To get game price

    public Transaction create(Transaction transaction) {
        log.info("Creating transaction for member {} and game {}", transaction.getMemberId(), transaction.getGameId());
        transaction.setId(null);
        
        // --- Business Logic ---
        Member member = memberRepo.findById(transaction.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Cannot create transaction: Member not found with id: " + transaction.getMemberId()));
        
        Game game = gameRepo.findById(transaction.getGameId())
                .orElseThrow(() -> new ResourceNotFoundException("Cannot create transaction: Game not found with id: " + transaction.getGameId()));
        
        // Use the actual game price for the transaction
        transaction.setAmount(game.getPrice());
        transaction.setDate(new Date()); // <-- THE FIX IS HERE: Set the current date

        validate(transaction, member);

        member.setBalance(member.getBalance() - transaction.getAmount());
        memberRepo.save(member);
        // --- End Logic ---

        return repo.save(transaction);
    }

    public List<Transaction> findAll() {
        log.info("Finding all transactions");
        return repo.findAll();
    }

    public List<Transaction> findByMemberId(String memberId) {
        log.info("Finding transactions for member id: {}", memberId);
        return repo.findByMemberId(memberId);
    }

    private void validate(Transaction transaction, Member member) {
        if (transaction.getAmount() < 0) {
            throw new BusinessException("Transaction amount cannot be negative.");
        }
        if (member.getBalance() < transaction.getAmount()) {
            throw new BusinessException("Insufficient balance for this transaction.");
        }
    }
}