package com.github.hexronimo.reportmaker.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportsRepository extends MongoRepository<Report, ObjectId> {
	public List<Report> findByName(String name);
}