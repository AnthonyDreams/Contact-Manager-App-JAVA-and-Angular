package com.contactmanager.contact.repository;

import com.contactmanager.contact.model.Contact;
import com.contactmanager.contact.model.Phones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BaseRepository  extends JpaRepository<Contact, Long> {

    @Modifying
    @Query("delete from Phones b where b.Id=:id")
    void deletePhone(@Param("id") long id);



}
