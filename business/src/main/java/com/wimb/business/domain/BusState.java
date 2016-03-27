package com.wimb.business.domain;

public class BusState {
    private int id;
    private Bus bus;
    private Location location;
    private RoutePoint prevPoint;
    private RoutePoint nextPoint;
    private BusStop prevStop;
    private BusStop nextStop;
}
