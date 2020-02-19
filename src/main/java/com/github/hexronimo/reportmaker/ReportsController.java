package com.github.hexronimo.reportmaker;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import javax.imageio.ImageIO;

import org.bson.BsonBinarySubType;
import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.imgscalr.Scalr;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.github.hexronimo.reportmaker.exceptions.NotFoundException;
import com.github.hexronimo.reportmaker.model.Doc;
import com.github.hexronimo.reportmaker.model.DocsRepository;
import com.github.hexronimo.reportmaker.model.DocumentPhotoReport;
import com.github.hexronimo.reportmaker.model.Layout;
import com.github.hexronimo.reportmaker.model.LayoutsRepository;
import com.github.hexronimo.reportmaker.model.Photo;
import com.github.hexronimo.reportmaker.model.Report;
import com.github.hexronimo.reportmaker.model.ReportsRepository;

@RestController
@RequestMapping(value = "/reports-maker/reports")
public class ReportsController {

	private final ReportsRepository reportsRepository;
	private final LayoutsRepository layoutDefaults;
	private final DocsRepository docRepository;

	public ReportsController(ReportsRepository reportsRepository, LayoutsRepository layoutDefaults, DocsRepository docRepository) {
		this.reportsRepository = reportsRepository;
		this.layoutDefaults = layoutDefaults;
		this.docRepository = docRepository;

		List<Layout> result = layoutDefaults.findAll();
		if (result == null || result.size() == 0) {
			Layout l = new Layout();
			layoutDefaults.save(l);
		}
	}

	@GetMapping()
	public List<Report> listAll() {
		return reportsRepository.findAll();
	}

	@GetMapping("{id}")
	public Report getReport(@PathVariable ObjectId id) {
		Optional<Report> result = reportsRepository.findById(id);
		if (result.isEmpty()) throw new NotFoundException();
		return result.get();
	}

	@PostMapping()
	public Report create(@RequestBody Report report) {
		reportsRepository.save(report);
		return report;
	}

	@PutMapping("{id}")
	public Report update(@PathVariable ObjectId id, @RequestBody Report report) {
		//TODO check if report id is the same as object id if no throw error
		reportsRepository.save(report);
		return report;
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable ObjectId id) {
		Report report = getReport(id);
		reportsRepository.delete(report);
	}

	@GetMapping("/layout")
	public List<Layout> getLayout() {
		List<Layout> result = layoutDefaults.findAll();
		if (result.isEmpty())
			throw new NotFoundException();
		return result;
	}

	@PutMapping("/layout")
	public Layout updateLayout(@RequestBody Layout layout) {
		if (layout != null && !layout.getId().equals(layoutDefaults.findAll().get(0).getId())) {
			layoutDefaults.deleteAll();
		}
		layoutDefaults.save(layout);
		return layoutDefaults.findAll().get(0);
	}

	@GetMapping("/photo/{id}")
	public Doc getPhoto(@PathVariable ObjectId id) {
		Optional<Doc> doc = docRepository.findById(id);
		return doc.get();
	}

	@PutMapping("/doc")
	public Doc saveDoc(@RequestBody DocumentPhotoReport doc) {
		docRepository.save(doc);
		return doc;
	}
	
	@GetMapping("/doc/{id}")
	public Doc getDoc(@PathVariable ObjectId id) {
		Optional<Doc> result = docRepository.findById(id);
		if (result.isEmpty()) throw new NotFoundException();
		return result.get();
	}

	@PostMapping("/photo")
	public List<Photo> addPhoto(MultipartHttpServletRequest request) {

		Iterator<String> iterator = request.getFileNames();
		List<Photo> photoList = new ArrayList<>();
		MultipartFile multipartFile = null;

		while (iterator.hasNext()) {
			multipartFile = request.getFile(iterator.next());

			ByteArrayOutputStream thumbOutput = new ByteArrayOutputStream();
			BufferedImage thumbImg = null;
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			try {
				BufferedImage img = ImageIO.read(multipartFile.getInputStream());
				thumbImg = Scalr.resize(img, Scalr.Method.AUTOMATIC, Scalr.Mode.AUTOMATIC, 1000, Scalr.OP_ANTIALIAS);
				ImageIO.write(thumbImg, multipartFile.getContentType().split("/")[1], baos);
				baos.flush();

				Photo photo = new Photo();
				photo.setImageBinary(new Binary(BsonBinarySubType.BINARY, baos.toByteArray()));
				photoList.add(photo);

				// photoRepository.save(photo);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
		return photoList;

	}

}
