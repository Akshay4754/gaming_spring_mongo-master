package com.gamezone.ecomsystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gamezone.ecomsystem.dto.MemberProfileDto;
import com.gamezone.ecomsystem.dto.SearchRequestDto;
import com.gamezone.ecomsystem.model.Member;
import com.gamezone.ecomsystem.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/members")
public class MemberController {

    @Autowired
    private MemberService service; // <-- Injects the Service, not the Repository

    @PostMapping
    public ResponseEntity<Member> create(@Valid @RequestBody Member member) {
        Member createdMember = service.create(member);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMember);
    }

    @GetMapping
    public ResponseEntity<List<Member>> findAll() {
        List<Member> members = service.findAll();
        return ResponseEntity.ok(members);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> findById(@PathVariable String id) {
        Member member = service.findById(id);
        return ResponseEntity.ok(member);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> update(@PathVariable String id, @Valid @RequestBody Member member) {
        Member updatedMember = service.update(id, member);
        return ResponseEntity.ok(updatedMember);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/search")
    public ResponseEntity<MemberProfileDto> searchMemberByPhone(@RequestBody SearchRequestDto searchRequest) {
        MemberProfileDto profile = service.getMemberProfileByPhone(searchRequest.getPhone());
        return ResponseEntity.ok(profile);
    }
    
}