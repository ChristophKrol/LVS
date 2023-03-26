package de.lagerverwaltung.software.service;

import de.lagerverwaltung.software.model.Item;

import java.util.Collection;

public interface ItemService {
    Item create(Item item);
    Collection<Item> list(int limit);
    Item get(Long id);
    Item update(Item item);
    Boolean delete(Long id);

}
