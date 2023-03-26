package de.lagerverwaltung.software;

import de.lagerverwaltung.software.enumeration.Category;
import de.lagerverwaltung.software.model.Item;
import de.lagerverwaltung.software.repository.ItemRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import static de.lagerverwaltung.software.enumeration.Category.*;

@SpringBootApplication
public class SoftwareApplication {

	public static void main(String[] args) {
		SpringApplication.run(SoftwareApplication.class, args);
	}

	@Bean
	CommandLineRunner run(ItemRepo itemRepo){
		return args -> {
			itemRepo.save(new Item(null, "Gurke", 0.4, 1
					, GROCERIES, GROCERIES.getImageUrl()));
			itemRepo.save(new Item(null, "Laptop", 100, 7
					, ELECTRONIC_DEVICES, ELECTRONIC_DEVICES.getImageUrl()));
			itemRepo.save(new Item(null, "Gartenstuhl", 4, 15
					, SEASON_ITEMS, SEASON_ITEMS.getImageUrl()));
			itemRepo.save(new Item(null, "Seife", 1, 1
					, HYGIENE_ITEMS, HYGIENE_ITEMS.getImageUrl()));
		};

	};

}
