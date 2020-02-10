package com.github.hexronimo.reportmaker.model;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DocsRepository extends MongoRepository<Doc, ObjectId> {
}