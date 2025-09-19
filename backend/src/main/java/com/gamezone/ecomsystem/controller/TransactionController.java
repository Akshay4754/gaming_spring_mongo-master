package com.gamezone.ecomsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gamezone.ecomsystem.model.Transaction;
import com.gamezone.ecomsystem.service.TransactionService;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService service; // <-- Injects the Service

    @PostMapping
    public ResponseEntity<Transaction> create(@RequestBody Transaction transaction) {
        Transaction createdTransaction = service.create(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> findAll() {
        List<Transaction> transactions = service.findAll();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Transaction>> findByMemberId(@PathVariable String memberId) {
        List<Transaction> transactions = service.findByMemberId(memberId);
        return ResponseEntity.ok(transactions);
    }
}