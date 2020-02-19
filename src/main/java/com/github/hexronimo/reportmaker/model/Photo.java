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
	
	private String text;

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
		return Base64.getEncoder().encodeToString(image.getData());
	}

	public String getText() {
		if (text == null) return "";
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public void setImageBinary(Binary image) {
		this.image = image;
	}

	public void setImage(String data) {
		image = new Binary(Base64.getDecoder().decode(data));
	}

}
