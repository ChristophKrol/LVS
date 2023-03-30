package de.lagerverwaltung.software.repository;

import de.lagerverwaltung.software.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


/**
 * Wird für (Custom) queries genutzt
 */
public interface ItemRepo extends JpaRepository<Item, Long> {

    @Query(value = "SELECT * FROM item WHERE category = :category", nativeQuery = true)
    List<Item> filterItemsByCategory(@Param("category") int category);

    @Query(value = "SELECT COUNT(*) AS 'count', category AS 'category' FROM item GROUP BY category ORDER BY category ASC;", nativeQuery = true)
    List<CategoryGrouped> groupByCategory();

    @Query(value = "SELECT SUM(price) AS 'price', category FROM item GROUP BY category ORDER BY category ASC;", nativeQuery = true)
    List<CategoryPriceSum> groupedByPriceSumsByCategory();

    public static interface CategoryGrouped {
        int getCategory();

        int getCount();
    }

    public static interface CategoryPriceSum {
        int getCategory();

        double getPrice();
    }

}
