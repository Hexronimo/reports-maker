package com.github.hexronimo.reportmaker;

import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping(value = "/reports-maker/reports")
public class UnRestController {

    @PostMapping("/photo")
    public void addPhoto(@RequestParam("photos") List<MultipartFile> photo) {

        Path filepath = Paths.get("photos/", photo.get(0).getOriginalFilename());
        try (OutputStream os = Files.newOutputStream(filepath)) {
            os.write(photo.get(0).getBytes());
        } catch(Exception e) {}

    }


}
