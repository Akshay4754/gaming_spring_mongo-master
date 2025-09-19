package com.gamezone.ecomsystem.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gamezone.ecomsystem.model.Product; 

public interface ProductRepository extends MongoRepository<Product, String>{

}
