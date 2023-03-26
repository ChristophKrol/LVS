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
			itemRepo.save(new Item(null, "Gurke", 0.5, 1, GROCERIES));
			itemRepo.save(new Item(null, "Laptop", 1000, 7, ELECTRONIC_DEVICES));
			itemRepo.save(new Item(null, "Gartenstuhl", 14, 20, SEASON_ITEMS));
			itemRepo.save(new Item(null, "Besen", 5, 7, HOUSEHOLD_ITEMS));
			itemRepo.save(new Item(null, "Seife", 0.8, 1, HYGIENE_ITEMS));

		};

	};

}
