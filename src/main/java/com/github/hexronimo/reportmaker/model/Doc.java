package com.github.hexronimo.reportmaker.model;


public interface Doc {

	public String getId();

	public void setLayout(Layout layuot);

	public Layout getLayout();

	public void setData(String data);

	public String getData();

}
