package com.github.hexronimo.reportmaker.model;

import org.bson.types.ObjectId;

public class Document implements Doc {

	private ObjectId _id;
	private String data;
	private Layout layout;

	public Document() {
		_id = new ObjectId();
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

}
