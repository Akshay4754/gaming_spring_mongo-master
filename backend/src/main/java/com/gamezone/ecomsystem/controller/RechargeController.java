package com.gamezone.ecomsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gamezone.ecomsystem.model.Recharge;
import com.gamezone.ecomsystem.service.RechargeService;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/recharges")
public class RechargeController {

    @Autowired
    private RechargeService service; // <-- Injects the Service

    @PostMapping
    public ResponseEntity<Recharge> create(@RequestBody Recharge recharge) {
        Recharge createdRecharge = service.create(recharge);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRecharge);
    }

    @GetMapping
    public ResponseEntity<List<Recharge>> findAll() {
        List<Recharge> recharges = service.findAll();
        return ResponseEntity.ok(recharges);
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Recharge>> findByMemberId(@PathVariable String memberId) {
        List<Recharge> recharges = service.findByMemberId(memberId);
        return ResponseEntity.ok(recharges);
    }
}