package de.lagerverwaltung.software.service.implementation;

import de.lagerverwaltung.software.model.Item;
import de.lagerverwaltung.software.repository.ItemRepo;
import de.lagerverwaltung.software.service.ItemService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collection;


/*
* ServerServiceImpl implementiert Funktionen, die später Datenbakabfragen durchführen
* */

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class ItemServiceImpl implements ItemService {
    private final ItemRepo itemRepo;

    /**
     * Erstellt neue Items
     * @param item Item, das erstellt werden soll
     * @return Rckmeldung ueber erstelltes Item
     */
    @Override
    public Item create(Item item) {
        log.info("Saving new item: {}", item.getName());
        item.setImageUrl(item.getCategory().getImageUrl()); //Set Image of items category
        return itemRepo.save(item);
    }


    /**
     * Gibt Liste der Items aus
     * @param limit Definiert, wie viele Items gezeigt werden sollen
     * @return Liste der Items
     */
    @Override
    public Collection<Item> list(int limit) {
        log.info("Fetching all items");
        return itemRepo.findAll(PageRequest.of(0, limit)).toList();
    }

    /**
     * Gibt ein ausgewaehltes Item zurück
     * @param id ID des Items
     * @return ausgewaehltes Item
     */
    @Override
    public Item get(Long id) {
        log.info("Fetching chosen Item by id: {}", id);
        return itemRepo.findById(id).get();
    }

    /**
     * Aendert Eigenschaften eines Items
     * @param item Items, das geaendert werden soll
     * @return Response
     */
    @Override
    public Item update(Item item) {
        log.info("Updating item: {}", item.getName());
        return itemRepo.save(item);
    }

    /**
     * Loescht Item
     * @param id ID des zu loeschenden Items
     * @return Response
     */
    @Override
    public Boolean delete(Long id) {
        log.info("Deleting item by ID: {}", id);
        itemRepo.deleteById(id);
        return Boolean.TRUE;
    }

}
