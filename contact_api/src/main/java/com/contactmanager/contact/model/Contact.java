package com.contactmanager.contact.model;


import com.contactmanager.contact.repository.BaseRepository;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jdk.nashorn.internal.objects.annotations.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;


class Miscelaneous {

    public static void addPhoneWithQuery(List<Phones> phones_, long contact_id, EntityManager entityManager) {

        for (Phones phone : phones_) {
            if (phone.getId() == 0) {
                entityManager.createNativeQuery("INSERT INTO phones (Id, type, number, contact_id) VALUES (?,?,?,?)")
                        .setParameter(1, phone.getIdFromQuery(entityManager))
                        .setParameter(2, phone.getType())
                        .setParameter(3, phone.getNumber())
                        .setParameter(4, contact_id).executeUpdate();


            } else {
                entityManager.createNativeQuery("UPDATE phones SET type = ?, number = ? WHERE Id = ?")
                        .setParameter(3, phone.getId())
                        .setParameter(1, phone.getType())
                        .setParameter(2, phone.getNumber())
                        .executeUpdate();

            }
        }
    }

}

@Entity
@Table(name = "contact")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Contact implements Serializable {

    @javax.persistence.Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;

    @Column(name="name", nullable=false)
    private String name;

    @Column(name = "email", nullable = false)
    private String email;

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @JoinColumn(name = "contact_id")
    private Set<Phones> phones = new HashSet<>();

    public void setPhones(List<Phones> phone_, EntityManager entityManager){
        Miscelaneous.addPhoneWithQuery(phone_, this.getId(), entityManager);

    }



    public Set<Phones> getPhones(){
        return this.phones;
    }
    public void setName(String name){
        this.name = name;
    }

    public String getName(){
        return this.name;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public String getEmail(){
        return this.email;
    }

    public long getId(){
        return this.Id;
    }


    public void setId(long Id){
        this.Id = Id;
    }




}
