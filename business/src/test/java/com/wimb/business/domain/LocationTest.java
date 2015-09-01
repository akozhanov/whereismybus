package com.wimb.business.domain;

import org.junit.Test;

import static junit.framework.Assert.assertEquals;

/**
 * Created by akozhanov on 8/18/2015.
 */

public class LocationTest {

    @Test
    public void testCreateLocation(){
        Location l = new Location(50.464607, 30.405949);
        assertEquals(50.464607, l.getLat());
        assertEquals(30.405949, l.getLon());
    }
}
