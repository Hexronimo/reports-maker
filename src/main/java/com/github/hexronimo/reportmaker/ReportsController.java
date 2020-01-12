package com.github.hexronimo.reportmaker;

import java.util.List;
import java.util.Optional;

import com.github.hexronimo.reportmaker.exceptions.NotFoundException;
import com.github.hexronimo.reportmaker.model.Report;
import com.github.hexronimo.reportmaker.model.ReportsRepository;

import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/reports-maker/reports")
public class ReportsController {

    private final ReportsRepository repo;
    
    public ReportsController(ReportsRepository repo) {
    	this.repo = repo;
    }

    @GetMapping()
    public List<Report> listAll() {
        return repo.findAll();
    }
       
    @GetMapping("{id}")
    public Report getReport(@PathVariable ObjectId id){
    	Optional<Report> result = repo.findById(id);
    	if (result.isEmpty()) throw new NotFoundException();
    	return result.get();
    }
    
    @PostMapping()
    public List<Report> create(@RequestBody Report report){
    	repo.save(report);
    	return repo.findAll();
    }
    
    @PutMapping ("{id}")
    public List<Report> update(@PathVariable ObjectId id, @RequestBody Report report){
    	repo.save(report);
    	return repo.findAll();
    }
    
    @DeleteMapping ("{id}")
    public void delete(@PathVariable ObjectId id){
    	Report report = getReport(id);   	
    	repo.delete(report);
    }

}
