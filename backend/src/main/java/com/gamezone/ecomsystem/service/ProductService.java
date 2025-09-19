package com.gamezone.ecomsystem.service;


import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gamezone.ecomsystem.exception.BusinessException;
import com.gamezone.ecomsystem.exception.ResourceNotFoundException;
import com.gamezone.ecomsystem.model.Product;
import com.gamezone.ecomsystem.repository.ProductRepository;

@Service
public class ProductService {
	private static final Logger log = LoggerFactory.getLogger(ProductService.class);

	@Autowired
	private ProductRepository repo;
	
	public Product create(Product product) {
		log.info("Creating product: {}", product.getName());
		product.setId(null);
		validate(product);
		Product savedProduct = repo.save(product);		
		return savedProduct;
	}
	public List<Product> findAll() {
		log.info("Finding All Products");
		List<Product> products = repo.findAll();
		return products;
	}
	public Product findById(String id) {
		log.info("Finding Product By id {}", id);
		
		Optional<Product> optionalProduct = repo.findById(id);
		if(optionalProduct.isEmpty()) {
			log.error("Attempted to find non-existing product id: " + id);
			throw new ResourceNotFoundException("Product not found: " + id);
		}
		
		return optionalProduct.get();
	}
	public Product update(String id, Product product) {
		Optional<Product> optionalProduct = repo.findById(id);
		if(optionalProduct.isEmpty()) {
			log.error("Attempted to update non-existing product id: " + id);
			throw new ResourceNotFoundException("Product not found: " + id);
		}
		log.info("Updating Product By id {}", id);
		Product oldProduct = optionalProduct.get();
		oldProduct.setName(product.getName());
		oldProduct.setDescription(product.getDescription());
		oldProduct.setCategory(product.getCategory());
		oldProduct.setTags(product.getTags());
		oldProduct.setStock(product.getStock());
		oldProduct.setPrice(product.getPrice());
		//
		Product updatedProduct = repo.save(oldProduct);
		return updatedProduct;
	}
	public boolean delete(String id) { 
		Optional<Product> optionalProduct = repo.findById(id);
		if(optionalProduct.isEmpty()) {
			log.error("Attempted to delete non-existing product id: " + id);
			throw new ResourceNotFoundException("Product not found: " + id);
		}
		log.info("Deleting Product By id {}", id);
		repo.deleteById(id);
		return true;
	}
	
	private void validate(Product product) {
        if (product.getPrice() < 0) { 
        	log.error("Price cannot be negative");
        	throw new BusinessException("Price cannot be negative");
        }
        if (product.getStock() < 0) { 
        	log.error("Stock cannot be negative");
        	throw new BusinessException("Stock cannot be negative");
        }
    }
}