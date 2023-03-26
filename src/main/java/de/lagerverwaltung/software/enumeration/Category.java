package de.lagerverwaltung.software.enumeration;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

public enum Category {
    ELECTRONIC_DEVICES("ELECTRONIC_DEVICES"), //, "electronic_devices.png"
    GROCERIES("GROCERIES"), //, "groceries.png"
    SEASON_ITEMS("SEASON_ITEMS"), //, "season_items.png"
    HYGIENE_ITEMS("HYGIENE_ITEMS"), //, "hygiene_items.png"
    HOUSEHOLD_ITEMS("HOUSEHOLD_ITEMS"); //, "household_items.png"

    private final String category;

    Category(String category) {
        this.category = category;
    }

    //private final String imageUrl;

/*
    Category(String category, String imageUrl) {
        this.category = category;
        this.imageUrl = setImage(imageUrl);

    }

    /*
    private String setImage(String imageName){
        return ServletUriComponentsBuilder.fromCurrentContextPath().path("/software/images/" + imageName).toUriString();
    }
    */



    public String getCategory() {
        return this.category;
    }

    //public String getImageUrl() {
    //    return imageUrl;
    //}


}
