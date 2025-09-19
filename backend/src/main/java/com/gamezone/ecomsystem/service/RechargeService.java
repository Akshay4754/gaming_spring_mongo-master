package com.gamezone.ecomsystem.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gamezone.ecomsystem.exception.BusinessException;
import com.gamezone.ecomsystem.exception.ResourceNotFoundException;
import com.gamezone.ecomsystem.model.Member;
import com.gamezone.ecomsystem.model.Recharge;
import com.gamezone.ecomsystem.repository.MemberRepository;
import com.gamezone.ecomsystem.repository.RechargeRepository;

import java.util.List;

@Service
public class RechargeService {
    private static final Logger log = LoggerFactory.getLogger(RechargeService.class);

    @Autowired
    private RechargeRepository repo;

    @Autowired
    private MemberRepository memberRepo; // To update member balance

    public Recharge create(Recharge recharge) {
        log.info("Creating recharge for member: {}", recharge.getMemberId());
        recharge.setId(null);
        validate(recharge);

        // --- Business Logic ---
        // Find the member and update their balance
        Member member = memberRepo.findById(recharge.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Cannot create recharge: Member not found with id: " + recharge.getMemberId()));

        member.setBalance(member.getBalance() + recharge.getAmount());
        memberRepo.save(member);
        // --- End Logic ---

        return repo.save(recharge);
    }

    public List<Recharge> findAll() {
        log.info("Finding all recharges");
        return repo.findAll();
    }
    
    public List<Recharge> findByMemberId(String memberId) {
        log.info("Finding recharges for member id: {}", memberId);
        return repo.findByMemberId(memberId);
    }

    private void validate(Recharge recharge) {
        if (recharge.getAmount() <= 0) {
            throw new BusinessException("Recharge amount must be positive.");
        }
    }
}