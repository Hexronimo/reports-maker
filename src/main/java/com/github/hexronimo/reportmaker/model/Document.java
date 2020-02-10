package com.github.hexronimo.reportmaker.model;

import java.io.File;
import java.util.List;

import org.bson.types.ObjectId;

public class Document implements Doc {
	

	private ObjectId _id;
	private File file;
	private Layout layout;
	
	
	public Document() {
		_id = new ObjectId();
	}

	@Override
	public Layout getLayout() {
		return layout;
	}

	@Override
	public File getFile() {
		return file;
	}

	@Override
	public void setFile(File file) {
		this.file = file;
	}

	@Override
	public String getId() {
		return _id.toHexString();
	}

	@Override
	public List<String> parseDoc() {
		// TODO Auto-generated method stub
		return null;
	}
	
}
