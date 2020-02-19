package com.github.hexronimo.reportmaker.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Layout {
	
	@Id 
	private ObjectId id;
	
	private String headLeft;
	private String headRight;
	
	private String body;
	
	private String footerLeft;
	private String footerCenter;
	private String footerRight;
	private String footer;
	
	private String directorPosition;
	private String directorName;
	private String organization;
	
	
	public Layout() {
		id  = new ObjectId();
	}

	public String getHeadLeft() {
		if (headLeft == null) return "";
		return headLeft;
	}

	public void setHeadLeft(String headLeft) {
		this.headLeft = headLeft;
	}

	public String getHeadRight() {
		if (headRight == null) return "";
		return headRight;
	}

	public void setHeadRight(String headRight) {
		this.headRight = headRight;
	}

	public String getBody() {
		if (body == null) return "";
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public String getFooterLeft() {
		if (footerLeft == null) return "";
		return footerLeft;
	}

	public void setFooterLeft(String footerLeft) {
		this.footerLeft = footerLeft;
	}

	public String getFooterCenter() {
		if (footerCenter == null) return "";
		return footerCenter;
	}

	public void setFooterCenter(String footerCenter) {
		this.footerCenter = footerCenter;
	}

	public String getFooterRight() {
		if (footerRight == null) return "";
		return footerRight;
	}

	public void setFooterRight(String footerRight) {
		this.footerRight = footerRight;
	}

	public String getFooter() {
		if (footer == null) return "";
		return footer;
	}

	public void setFooter(String footer) {
		this.footer = footer;
	}

	public String getId() {
		return id.toHexString();
	}

	public String getDirectorPosition() {
		return directorPosition;
	}

	public void setDirectorPosition(String directorPosition) {
		this.directorPosition = directorPosition;
	}

	public String getDirectorName() {
		return directorName;
	}

	public void setDirectorName(String directorName) {
		this.directorName = directorName;
	}

	public String getOrganization() {
		return organization;
	}

	public void setOrganization(String organization) {
		this.organization = organization;
	}
	
	
}
