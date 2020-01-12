package com.github.hexronimo.reportmaker.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;

@Document
public class Report {
	
	@Id
    private ObjectId id;
	private String name;
	private String dateStart;
	private String dateEnd;

    public Report(String name, String dateStart, String dateEnd) {
        this.name = name;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        id = new ObjectId();
    }
  
    public String getId() {
    	  return id.toHexString();
    }

	public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDateStart() {
        return dateStart;
    }

    public void setDateStart(String dateStart) {
        this.dateStart = dateStart;
    }

    public String getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(String dateEnd) {
        this.dateEnd = dateEnd;
    }
}

