package com.gamezone.ecomsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import com.gamezone.ecomsystem.model.Admin;
import com.gamezone.ecomsystem.model.Member;
import com.gamezone.ecomsystem.model.Game;
import com.gamezone.ecomsystem.model.Transaction;
import com.gamezone.ecomsystem.model.Recharge;

import java.util.Date;
import java.util.List;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private AdminService adminService;

    @Autowired
    private MemberService memberService;

    @Autowired
    private GameService gameService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private RechargeService rechargeService;

    @Override
    public void run(String... args) throws Exception {
        initializeData();
    }

    private void initializeData() {
        // Initialize Admin
        if (adminService.findAll().isEmpty()) {
            Admin admin = new Admin("admin", "admin@gamezone.com", "GameZone Administrator");
            adminService.create(admin);
            System.out.println("Admin created: " + admin.getUsername());
        }

        // Initialize Sample Games
        if (gameService.findAll().isEmpty()) {
            List<Game> games = List.of(
                new Game("Cyberpunk 2077", 59.99, "An open-world, action-adventure story set in Night City.", "RPG", "PC"),
                new Game("The Witcher 3", 39.99, "A story-driven open world RPG set in a fantasy universe.", "RPG", "PC"),
                new Game("Grand Theft Auto V", 29.99, "Experience the ultimate open-world adventure.", "Action", "PC"),
                new Game("Minecraft", 26.95, "Build, explore, and survive in a blocky world.", "Sandbox", "PC"),
                new Game("Among Us", 4.99, "A multiplayer game of teamwork and betrayal.", "Social", "PC"),
                new Game("Valorant", 0.00, "A 5v5 character-based tactical shooter.", "FPS", "PC"),
                new Game("Fortnite", 0.00, "Battle royale game with building mechanics.", "Battle Royale", "PC"),
                new Game("Call of Duty: Warzone", 0.00, "Free-to-play battle royale game.", "Battle Royale", "PC")
            );
            
            for (Game game : games) {
                gameService.create(game);
            }
            System.out.println("Sample games created: " + games.size());
        }

        // Initialize Sample Members
        List<Member> existingMembers = memberService.findAll();
        if (existingMembers.size() < 5) {
            List<Member> membersToCreate = List.of(
                createMember("John Doe", "john@example.com", "1234567890", 500.0),
                createMember("Jane Smith", "jane@example.com", "0987654321", 300.0),
                createMember("Mike Johnson", "mike@example.com", "1122334455", 400.0),
                createMember("Sarah Wilson", "sarah@example.com", "5566778899", 250.0),
                createMember("David Brown", "david@example.com", "9988776655", 350.0)
            );
            
            int createdCount = 0;
            for (Member member : membersToCreate) {
                // Check if member with this email already exists
                boolean exists = existingMembers.stream()
                    .anyMatch(existing -> existing.getEmail().equals(member.getEmail()));
                
                if (!exists) {
                    memberService.create(member);
                    createdCount++;
                }
            }
            System.out.println("Sample members created: " + createdCount);
        }

        // Initialize Sample Transactions and Recharges
        List<Member> members = memberService.findAll();
        List<Game> games = gameService.findAll();
        
        if (transactionService.findAll().isEmpty() && !members.isEmpty() && !games.isEmpty()) {
            // Create some transactions (with bounds checking and balance validation)
            int transactionCount = Math.min(3, Math.min(members.size(), games.size()));
            for (int i = 0; i < transactionCount; i++) {
                Member member = members.get(i);
                Game game = games.get(i);
                
                // Only create transaction if member has sufficient balance
                if (member.getBalance() >= game.getPrice()) {
                    Transaction tx = new Transaction(member.getId(), game.getId(), game.getPrice(), new Date());
                    transactionService.create(tx);
                } else {
                    System.out.println("Skipping transaction for " + member.getName() + " - insufficient balance");
                }
            }
            System.out.println("Sample transactions created: " + transactionCount);
        }

        if (rechargeService.findAll().isEmpty() && !members.isEmpty()) {
            // Create some recharges (with bounds checking)
            int rechargeCount = Math.min(3, members.size());
            String[] paymentMethods = {"Credit Card", "PayPal", "Bank Transfer"};
            double[] amounts = {50.0, 100.0, 75.0};
            
            for (int i = 0; i < rechargeCount; i++) {
                Recharge rc = new Recharge(members.get(i).getId(), amounts[i], paymentMethods[i], new Date());
                rechargeService.create(rc);
            }
            System.out.println("Sample recharges created: " + rechargeCount);
        }
    }

    private Member createMember(String name, String email, String phoneNumber, double balance) {
        Member member = new Member();
        member.setName(name);
        member.setEmail(email);
        member.setPhoneNumber(phoneNumber);
        member.setBalance(balance);
        member.setRole("USER");
        return member;
    }
}
