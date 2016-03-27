package com.wimb.business.domain;

/**
 * Created by andrew on 27.03.16.
 */
public class RouteLocation extends Location {

    private String name;

    public RouteLocation(String name, double lat, double lon) {
        super(lat, lon);
    }
}
