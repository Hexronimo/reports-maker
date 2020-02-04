package com.github.hexronimo.reportmaker.model;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LayoutsRepository extends MongoRepository<Layout, ObjectId> {
}
