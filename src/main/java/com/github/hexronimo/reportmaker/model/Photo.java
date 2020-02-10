package com.github.hexronimo.reportmaker.model;

import java.util.Base64;

import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Photo {
    @Id
    private ObjectId id;
     
    private String title;
         
    private Binary image;
    
    public Photo() {
    	id = new ObjectId();
    }

	public String getId() {
		return id.toHexString();
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getImage() {
		return "data:image/jpg;base64," + Base64.getEncoder().encodeToString(image.getData());
	}

	public void setImage(Binary image) {
		this.image = image;
	}
    
    
}
