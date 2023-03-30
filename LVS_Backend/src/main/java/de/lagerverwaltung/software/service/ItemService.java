package de.lagerverwaltung.software.service;

import de.lagerverwaltung.software.enumeration.Category;
import de.lagerverwaltung.software.model.Item;

import java.util.Collection;
import java.util.List;

public interface ItemService {
    Item create(Item item);
    Collection<Item> list(int limit);
    Collection<Item> listByCategory(int category);
    Item get(Long id);
    Item update(Item item);
    Boolean delete(Long id);



}
