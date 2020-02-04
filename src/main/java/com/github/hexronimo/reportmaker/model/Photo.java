package com.github.hexronimo.reportmaker.model;

import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "img")
public class Photo {
    @Id
    private ObjectId id;
     
    private String title;
         
    private Binary image;

	public String getId() {
		return id.toHexString();
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Binary getImage() {
		return image;
	}

	public void setImage(Binary image) {
		this.image = image;
	}
    
    
}
