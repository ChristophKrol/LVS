package de.lagerverwaltung.software.resource;


import de.lagerverwaltung.software.model.Item;
import de.lagerverwaltung.software.model.Response;
import de.lagerverwaltung.software.repository.ItemRepo;
import de.lagerverwaltung.software.service.implementation.ItemServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

import static org.springframework.http.HttpStatus.*;


/**
 * Erstellung der Response Objekte und deren URLs
 * Definition möglicher Abfragen
 */
@RestController
@RequestMapping(value = "/server")
@RequiredArgsConstructor
public class ServerResource {
    private final ItemServiceImpl itemService;

    private final ItemRepo itemRepository;

    /**
     * ITEM
     * Baut das Response-Objekt fuer Get-Request: mehrere Items
     * @return Response
     */
    @GetMapping("/item/list")
    public ResponseEntity<Response> getItems(){
        return ResponseEntity.ok(
                Response.builder().timestamp(LocalDateTime.now())
                        .data(Map.of("items", itemService.list(30)))
                        .message("Items retrieved")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }


    @GetMapping("/item/{category}")
    public ResponseEntity<Response> getItemsByCategory(@PathVariable("category")int category){
        return ResponseEntity.ok(
                Response.builder().timestamp(LocalDateTime.now())
                        .data(Map.of("items", itemService.listByCategory(category)))
                        .message("Items of chosen category retrieved")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }

    @GetMapping("/item/test")
    public ResponseEntity<Response> testestetstesttetst(){
        return ResponseEntity.ok(
                Response.builder().timestamp(LocalDateTime.now())
                        .data(Map.of("catGroup", this.itemRepository.groupByCategory()))
                        .message("Items of chosen category retrieved")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }

    @GetMapping("/item/test2")
    public ResponseEntity<Response> testestetstesttetsts(){
        return ResponseEntity.ok(
                Response.builder().timestamp(LocalDateTime.now())
                        .data(Map.of("catPriceSum", this.itemRepository.groupedByPriceSumsByCategory()))
                        .message("Items of chosen category retrieved")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }

    /**
     * Baue das Response-Objekt für Get-Request: ein Item
     * @param id ID des Items
     * @return Response
     */
    @GetMapping("/item/get/{id}")
    public ResponseEntity<Response> getItem(@PathVariable("id") Long id) {
        return ResponseEntity.ok(
                Response.builder().timestamp(LocalDateTime.now())
                        .data(Map.of("items", itemService.get(id)))
                        .message("Item retrieved")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }

    /**
     * Baue das Response-Objekt fuer Post-Request: Item speichern
     * @param item zu speicherndes Item
     * @return Response
     */
    @PostMapping("/item/save")
    public ResponseEntity<Response> saveItem(@RequestBody Item item) {
        return ResponseEntity.ok(
                Response.builder()
                        .timestamp(LocalDateTime.now())
                        .data(Map.of("item", itemService.create(item)))
                        .message("Item created")
                        .status(CREATED)
                        .statusCode(CREATED.value())
                        .build()
        );
    }

    /**
     * Baue das Response-Objekt für Delete-Request: Item loeschen
     * @param id ID des Items
     * @return Response
     */
    @DeleteMapping("/item/delete/{id}")
    public ResponseEntity<Response> deleteItem(@PathVariable("id") Long id) {
        return ResponseEntity.ok(
                Response.builder().timestamp(LocalDateTime.now())
                        .data(Map.of("deleted", itemService.delete(id)))
                        .message("Item deleted")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }


    //Test Request
    @GetMapping("/test")
    public ResponseEntity<String> testRequest(){
        String response = "Hello";
        return new ResponseEntity<>(OK);
    }

    //@GetMapping(path="/image/{filename}", produces = IMAGE_PNG_VALUE) // Erstellt PNG-Werte, keine JSONs
    //public byte[] getCategoryImage(@PathVariable("filename") String filename) throws IOException {
    //   return Files.readAllBytes(Paths.get("src", "main", "java", "de"
    //           , "lagerverwaltung", "software", "images", filename));
    //}
//
}
