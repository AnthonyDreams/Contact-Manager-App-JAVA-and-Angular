package com.contactmanager.contact.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name="phones")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Phones implements Serializable {

    @javax.persistence.Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long Id;

    @Column(name = "type", nullable = false)
    public String type;

    @Column(name = "number", nullable = false)
    public String number;


    public String getType(){
        return this.type;

    }

    public void setType(String type){
        this.type = type;
    }

    public String getNumber(){
        return this.number;
    }

    public void setNumber(String number){
        this.number = number;
    }

    public long getId(){return this.Id;}

    public void setId(long id){
        this.Id = id;
    }

    public long getIdFromQuery(EntityManager em){

//      I'm not proud of this either but i was going crazy with nativequery not setting my id value by itself. :(
        return em.createQuery("SELECT MAX(Id) FROM Phones", Long.class).getSingleResult() + 1 ;
    }

}
