package com.github.hexronimo.reportmaker;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import com.github.hexronimo.reportmaker.exceptions.NotFoundException;
import com.github.hexronimo.reportmaker.model.Report;
import com.github.hexronimo.reportmaker.model.ReportsRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/reports-maker")
public class ReportsController {

    private final ReportsRepository repo;
    
    public ReportsController(ReportsRepository repo) {
    	this.repo = repo;
    }

    @GetMapping("/reports")
    public List<Report> listAll() {
        return repo.findAll();
    }
       
    @GetMapping("/reports/{id}")
    public Report getReport(@PathVariable ObjectId id){
    	Optional<Report> result = repo.findById(id);
    	if (result.isEmpty()) throw new NotFoundException();
    	return result.get();
    }
    
    @PostMapping("/reports")
    public List<Report> create(@RequestBody Report report){
    	repo.save(report);
    	return repo.findAll();
    }
    
    @PutMapping ("reports/{id}")
    public List<Report> update(@PathVariable ObjectId id, @RequestBody Report report){
    	repo.save(report);
    	return repo.findAll();
    }
    
    @DeleteMapping ("reports/{id}")
    public void delete(@PathVariable ObjectId id){
    	Report report = getReport(id);   	
    	repo.delete(report);
    }

}
