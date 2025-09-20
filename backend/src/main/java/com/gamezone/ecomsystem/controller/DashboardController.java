package com.gamezone.ecomsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.gamezone.ecomsystem.service.MemberService;
import com.gamezone.ecomsystem.service.GameService;
import com.gamezone.ecomsystem.service.TransactionService;
import com.gamezone.ecomsystem.service.RechargeService;
import com.gamezone.ecomsystem.model.Member;
import com.gamezone.ecomsystem.model.Game;
import com.gamezone.ecomsystem.model.Transaction;
import com.gamezone.ecomsystem.model.Recharge;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private GameService gameService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private RechargeService rechargeService;

    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get all data
        List<Member> members = memberService.findAll();
        List<Game> games = gameService.findAll();
        List<Transaction> transactions = transactionService.findAll();
        List<Recharge> recharges = rechargeService.findAll();
        
        // Calculate statistics
        stats.put("totalMembers", members.size());
        stats.put("totalGames", games.size());
        stats.put("totalTransactions", transactions.size());
        stats.put("totalRecharges", recharges.size());
        
        // Calculate revenue
        double totalRevenue = transactions.stream()
            .mapToDouble(Transaction::getAmount)
            .sum();
        stats.put("totalRevenue", totalRevenue);
        
        // Calculate total recharges
        double totalRechargeAmount = recharges.stream()
            .mapToDouble(Recharge::getAmount)
            .sum();
        stats.put("totalRechargeAmount", totalRechargeAmount);
        
        // Active members (with balance > 0)
        long activeMembers = members.stream()
            .filter(member -> member.getBalance() > 0)
            .count();
        stats.put("activeMembers", activeMembers);
        
        // Recent transactions (last 10)
        List<Map<String, Object>> recentTransactions = transactions.stream()
            .sorted((t1, t2) -> t2.getDate().compareTo(t1.getDate()))
            .limit(10)
            .map(transaction -> {
                Map<String, Object> tx = new HashMap<>();
                tx.put("id", transaction.getId());
                tx.put("amount", transaction.getAmount());
                tx.put("date", transaction.getDate());
                tx.put("memberId", transaction.getMemberId());
                tx.put("gameId", transaction.getGameId());
                return tx;
            })
            .collect(Collectors.toList());
        stats.put("recentTransactions", recentTransactions);
        
        // Recent recharges (last 10)
        List<Map<String, Object>> recentRecharges = recharges.stream()
            .sorted((r1, r2) -> r2.getDate().compareTo(r1.getDate()))
            .limit(10)
            .map(recharge -> {
                Map<String, Object> rc = new HashMap<>();
                rc.put("id", recharge.getId());
                rc.put("amount", recharge.getAmount());
                rc.put("date", recharge.getDate());
                rc.put("memberId", recharge.getMemberId());
                return rc;
            })
            .collect(Collectors.toList());
        stats.put("recentRecharges", recentRecharges);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/user/{memberId}")
    public ResponseEntity<Map<String, Object>> getUserDashboard(@PathVariable String memberId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            // Get member details
            Member member = memberService.findById(memberId);
            dashboard.put("member", Map.of(
                "id", member.getId(),
                "name", member.getName(),
                "email", member.getEmail(),
                "balance", member.getBalance(),
                "phoneNumber", member.getPhoneNumber()
            ));
            
            // Get member's transactions
            List<Transaction> memberTransactions = transactionService.findByMemberId(memberId);
            dashboard.put("transactions", memberTransactions);
            
            // Get member's recharges
            List<Recharge> memberRecharges = rechargeService.findByMemberId(memberId);
            dashboard.put("recharges", memberRecharges);
            
            // Get all available games
            List<Game> games = gameService.findAll();
            dashboard.put("games", games);
            
            // Calculate total spent
            double totalSpent = memberTransactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
            dashboard.put("totalSpent", totalSpent);
            
            // Calculate total recharged
            double totalRecharged = memberRecharges.stream()
                .mapToDouble(Recharge::getAmount)
                .sum();
            dashboard.put("totalRecharged", totalRecharged);
            
            return ResponseEntity.ok(dashboard);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Member not found");
            return ResponseEntity.badRequest().body(error);
        }
    }
}
