package com.github.hexronimo.reportmaker.model;

import java.io.File;
import java.util.List;

public interface Doc {
	
	public void setFile(File file);
	public File getFile();
	
	public String getId();
	public Layout getLayout();
	
	public List<String> parseDoc();
}
