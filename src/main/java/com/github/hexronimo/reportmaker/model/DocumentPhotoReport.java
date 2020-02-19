package com.github.hexronimo.reportmaker.model;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
@Document
public class DocumentPhotoReport implements Doc {

	@Id
	private ObjectId id;
	private int type = 1; // one for Photoreports
	private String data;
	private Layout layout;

	private List<Photo> photos;

	public DocumentPhotoReport() {
		id = new ObjectId();
		photos = new ArrayList<>();
	}

	@Override
	public String getData() {
		return data;
	}

	@Override
	public void setData(String data) {
		this.data = data;
	}

	@Override
	public Layout getLayout() {
		return layout;
	}

	@Override
	public void setLayout(Layout layout) {
		this.layout = layout;
	}

	@Override
	public String getId() {
		return id.toHexString();
	}
	

	public void setPhotos(List<Photo> photos) {
		this.photos = photos;
	}

	public List<Photo> getPhotos() {
		return photos;
	}

	public int getType() {
		return type;
	}
}
