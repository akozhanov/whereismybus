package com.wimb.business.domain;

/**
 * Created by akozhanov on 8/18/2015.
 */
public class Location {
    private double lat;
    private double lon;

    public double getLat() {
        return lat;
    }

    public double getLon() {
        return lon;
    }

    public Location(double lat, double lon) {
        this.lat = lat;
        this.lon = lon;
    }

    @Override
    public String toString() {
        return "loc:" + this.lat + ", " + this.lon;
    }
}
