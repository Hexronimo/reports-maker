package com.github.hexronimo.reportmaker.model;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Report {
	
	@Id
    private ObjectId id;
	private String name;
	private String officialName;
	private LocalDate dateStart;
	private LocalDate dateEnd;
	
	private Map<String, Integer> docs; //Id and type
	
	public Report() {
		id = new ObjectId();
		docs = new LinkedHashMap<>();
	}

    public String getFancyDateStart() {
    	if (dateStart == null) return "";
    	String d = dateStart.format(DateTimeFormatter.ofPattern("d MMMM yyyy"));
		return d;
	}

	public String getFancyDateEnd() {
		if (dateEnd == null) return "";
    	String d = dateEnd.format(DateTimeFormatter.ofPattern("d MMMM yyyy"));
		return d;
	}

	public String getId() {
    	  return id.toHexString();
    }
    
    public void setOfficialName(String officialName) {
    	this.officialName = officialName;
    }

	public String getOfficialName() {
		if (officialName == null) return name;
		return officialName;
	}

	public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateStart() {
        return dateStart;
    }
   
    public void setDateStart(String dateStart) {
    	LocalDate date = LocalDate.parse(dateStart);
        this.dateStart = date;
    }

    
    public LocalDate getDateEnd() {
    	return dateEnd;
    }

    public void setDateEnd(String dateEnd) {
    	if (dateEnd != null && dateEnd.length() > 0) {
	    	LocalDate date = LocalDate.parse(dateEnd);
	        this.dateEnd = date;
    	}
    }

	public Map<String,Integer> getDocs() {
		return docs;
	}

	public void setDocs(Map<String,Integer> docs) {
		this.docs = docs;
	}
    
}