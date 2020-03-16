package com.contactmanager.contact;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@SpringBootApplication
public class ContactApplication {
	@PersistenceContext
	private EntityManager entityManager;
	public static void main(String[] args) {
		SpringApplication.run(ContactApplication.class, args);
	}

}
