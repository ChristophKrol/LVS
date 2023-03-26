package de.lagerverwaltung.software.repository;

import de.lagerverwaltung.software.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;


/**
 * Wird für Custom queries genutzt
 */
public interface ItemRepo extends JpaRepository<Item, Long> {



}
