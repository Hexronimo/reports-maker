package com.github.hexronimo.reportmaker.model;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;

public class DocumentPhotoReport extends Document {

	private ObjectId _id;
	private final int type = 1; // one for Photoreports
	private String data;
	private Layout layout;

	private List<String> photos;

	public DocumentPhotoReport() {
		_id = new ObjectId();
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
		return _id.toHexString();
	}

	public void setPhotos(List<String> photos) {
		this.photos = photos;
	}

	public List<String> getPhotos() {
		return photos;
	}

	public int getType() {
		return type;
	}
}
