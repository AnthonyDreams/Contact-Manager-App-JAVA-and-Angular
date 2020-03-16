package com.contactmanager.contact.controller.rest;

import com.contactmanager.contact.model.Phones;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.contactmanager.contact.repository.BaseRepository;
import com.contactmanager.contact.model.Contact;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("api/contact")
/// we know what this does >(
@CrossOrigin(origins = "*")
public class ContactRestController {

    @PersistenceContext
    public  EntityManager entityManager;

    @Autowired
    private BaseRepository contactRepository;



    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public Contact save(@RequestBody Contact contact){
            return contactRepository.save(contact);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> update(@PathVariable long id, @RequestBody Contact contact){
        Contact object = contactRepository.getOne(id);
        object.setEmail(contact.getEmail());
        object.setName(contact.getName());
        contactRepository.save(object);
        return ResponseEntity.ok(contactRepository.getOne(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable long id){
        contactRepository.deleteById(id);
        return ResponseEntity.ok(true);
    }

    @GetMapping()
    public ResponseEntity<List<Contact>> findAll(SpringDataWebProperties.Pageable pageable){
        return ResponseEntity.ok(contactRepository.findAll());
    }


    @GetMapping("/{Id}")
    public ResponseEntity<Contact> getById(@PathVariable long Id){
        return ResponseEntity.ok(contactRepository.getOne(Id));
    }


    @PutMapping("/{id}/phone")
    @Transactional
    public ResponseEntity<Contact> addPhone(@PathVariable long id, @RequestBody List<Phones> phone){
        Contact object = contactRepository.getOne(id);
        object.setPhones(phone, entityManager);
        return ResponseEntity.ok(contactRepository.getOne(id));
    }

    @GetMapping("/{id}/phone")
    public ResponseEntity<Set<Phones>> getPhone(@PathVariable long id){
        Contact object = contactRepository.getOne(id);
        return ResponseEntity.ok(object.getPhones());
    }

    @DeleteMapping("/{contact_id}/phone/{phone_id}")
    @Transactional
    public ResponseEntity<Boolean> deletePhone(@PathVariable long contact_id, @PathVariable long phone_id){
        contactRepository.deletePhone(phone_id);
        return ResponseEntity.ok(true);
    }
}
